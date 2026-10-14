import crypto from "crypto";
import type { Express, Request, Response, NextFunction } from "express";
import { enquiryCategory, categoryInfo } from "../src/data/enquiry.js";

// Role-based access for the Kinderbee management platform (CEO, Admin, Teacher Admin, Sales & Marketing,
// Franchise Partner). Every rule here is enforced on the server; the admin UI only mirrors it.
//
// Storage reuses the existing content store (Supabase `site_data` key/value table, or db.json locally),
// so no database migration is needed.

export const ROLES = {
  ceo: "CEO / Super Admin",
  admin: "Admin",
  teacher_admin: "Teacher Admin",
  sales: "Sales & Marketing",
  franchise: "Franchise Partner",
} as const;
export type Role = keyof typeof ROLES;

export const PERMS = {
  reports: "Dashboard & reports",
  leads: "Lead inbox & CRM (all branches)",
  leads_branch: "Branch leads (read-only)",
  leads_delete: "Delete leads",
  payments: "Payment verification",
  opportunities: "Joint ventures & opportunities",
  website: "Website content & approvals",
  attendance: "Staff & attendance",
  salary: "Salary & payslips",
  gallery: "Event photographs",
  finance: "Branch payments & receipts",
  notices: "Publish notices",
  audit: "Activity log",
  users: "Users, roles & permissions",
} as const;
export type Perm = keyof typeof PERMS;

const ALL = Object.keys(PERMS) as Perm[];
export const ROLE_DEFAULTS: Record<Role, Perm[]> = {
  ceo: ALL,
  admin: ["reports", "leads", "leads_delete", "payments", "opportunities", "website", "attendance", "gallery", "finance", "notices"],
  teacher_admin: ["attendance", "salary", "gallery"],
  sales: ["reports", "leads"],
  franchise: ["leads_branch", "attendance", "salary", "gallery", "finance"],
};
// Only a CEO account can ever hold these, whatever overrides are saved
const CEO_ONLY: Perm[] = ["users", "audit"];

export interface PortalUser {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  role: Role;
  branchIds?: string[];
  perms?: Perm[]; // overrides the role defaults when present
  active: boolean;
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthCtx {
  id: string;
  name: string;
  role: Role;
  perms: Perm[];
  /** null = all branches; otherwise the only branch ids this user may touch */
  scope: string[] | null;
  legacy?: boolean;
}

export const effectivePerms = (u: Pick<PortalUser, "role" | "perms">): Perm[] => {
  const base = u.perms && u.perms.length ? u.perms.filter(p => p in PERMS) : ROLE_DEFAULTS[u.role] || [];
  return u.role === "ceo" ? ALL : base.filter(p => !CEO_ONLY.includes(p));
};
export const scopeOf = (u: Pick<PortalUser, "role" | "branchIds">): string[] | null =>
  u.role === "ceo" ? null : u.role === "franchise" ? u.branchIds || [] : u.branchIds && u.branchIds.length ? u.branchIds : null;

// ---------- passwords & tokens ----------
export const hashPassword = (pw: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  return `s1$${salt}$${crypto.scryptSync(pw, salt, 64).toString("hex")}`;
};
const checkPassword = (pw: string, stored: string) => {
  const [v, salt, hash] = String(stored || "").split("$");
  if (v !== "s1" || !salt || !hash) return false;
  const a = crypto.scryptSync(pw, salt, 64);
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
const b64 = (s: string | Buffer) => Buffer.from(s).toString("base64url");
const TOKEN_HOURS = 12;

interface Deps {
  getContent: <T = any>(key: any) => Promise<T>;
  setContent: (key: any, value: any) => Promise<void>;
  getEnquiries: () => Promise<any[]>;
  listPayments: () => Promise<any[]>;
  /** token of the original ADMIN_PASSWORD login, which keeps working as the CEO account */
  legacyToken: () => string | null;
  safeEqual: (a: string, b: string) => boolean;
}

const IST = 5.5 * 3600 * 1000;
const today = () => new Date(Date.now() + IST).toISOString().slice(0, 10);
const uid = (p: string) => `${p}-${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`;
const clean = (v: any, max = 200) => String(v ?? "").trim().slice(0, max);
const num = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export function createPortal(d: Deps) {
  const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  const sign = (u: PortalUser) => {
    const body = b64(JSON.stringify({ uid: u.id, pv: u.passwordHash.slice(-8), exp: Date.now() + TOKEN_HOURS * 3600e3 }));
    return `u.${body}.${crypto.createHmac("sha256", secret()).update(body).digest("base64url")}`;
  };

  const users = async () => ((await d.getContent<PortalUser[]>("users")) || []) as PortalUser[];
  const publicUser = (u: PortalUser) => {
    const { passwordHash, ...rest } = u;
    return { ...rest, effectivePerms: effectivePerms(u), scope: scopeOf(u) };
  };

  // ---------- audit trail ----------
  // Readable names for the automatic log line written after any successful change
  const LABELS: [RegExp, string][] = [
    [/^PUT \/api\/enquiries/, "Lead updated"], [/^DELETE \/api\/enquiries/, "Lead deleted"], [/^POST \/api\/crm\/leads/, "Lead added"],
    [/^POST \/api\/crm\/activity/, "Lead activity logged"], [/\/api\/crm\/students/, "Student record saved"],
    [/^PUT \/api\/payments/, "Payment status changed"], [/\/api\/opportunities/, "Opportunity changed"],
    [/\/api\/(blogs|faqs|pages|settings)/, "Website content changed"], [/\/api\/upload/, "Image uploaded"],
    [/\/api\/portal\/staff/, "Staff record changed"], [/\/api\/portal\/payslips/, "Payslip saved"], [/\/api\/portal\/gallery/, "Event photo changed"],
    [/\/api\/portal\/ledger/, "Branch ledger changed"], [/\/api\/portal\/notices/, "Notice changed"], [/\/api\/portal\/branches/, "Branch changed"],
    [/change-password/, "Password changed"],
  ];
  const labelFor = (method: string, path: string) => LABELS.find(([re]) => re.test(`${method} ${path}`))?.[1] || `${method} ${path}`;

  async function audit(ctx: Pick<AuthCtx, "id" | "name" | "role">, action: string, detail = "") {
    (ctx as any).__logged = true; // the automatic line below is skipped when a handler logged something specific
    try {
      const log = ((await d.getContent<any[]>("audit")) || []) as any[];
      log.unshift({ id: uid("log"), at: new Date().toISOString(), userId: ctx.id, name: ctx.name, role: ctx.role, action, detail: detail.slice(0, 300) });
      await d.setContent("audit", log.slice(0, 2000));
    } catch (e: any) {
      console.warn("Audit write failed:", e.message); // an audit failure never blocks the action
    }
  }

  async function authenticate(req: Request): Promise<AuthCtx | null> {
    const header = String(req.headers.authorization || "");
    const legacy = d.legacyToken();
    if (legacy && d.safeEqual(header, `Bearer ${legacy}`)) {
      return { id: "ceo-root", name: "CEO", role: "ceo", perms: ALL, scope: null, legacy: true };
    }
    const m = header.match(/^Bearer (u\.[\w-]+\.[\w-]+)$/);
    if (!m || !secret()) return null;
    const [, body, mac] = m[1].split(".");
    const expect = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
    if (!d.safeEqual(mac, expect)) return null;
    let p: any;
    try { p = JSON.parse(Buffer.from(body, "base64url").toString()); } catch { return null; }
    if (!p || p.exp < Date.now()) return null;
    // Permissions are read fresh on every request, so removing access takes effect immediately
    const u = (await users()).find(x => x.id === p.uid);
    if (!u || !u.active || u.passwordHash.slice(-8) !== p.pv) return null;
    return { id: u.id, name: u.name, role: u.role, perms: effectivePerms(u), scope: scopeOf(u) };
  }

  const auth = (res: Response) => res.locals.auth as AuthCtx;

  /** Allows the request when the caller holds at least one of the listed permissions. */
  const guard = (...need: Perm[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ctx = await authenticate(req);
      if (!ctx) return res.status(403).json({ error: "Access denied. Please sign in again." });
      if (need.length && !need.some(p => ctx.perms.includes(p))) {
        return res.status(403).json({ error: "You do not have permission for this section." });
      }
      res.locals.auth = ctx;
      if (req.method !== "GET") {
        res.on("finish", () => { if (res.statusCode < 400 && !(ctx as any).__logged) audit(ctx, labelFor(req.method, `${req.baseUrl}${req.path}`), req.method === "DELETE" ? req.path : "").catch(() => {}); });
      }
      next();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  };

  const can = (ctx: AuthCtx, p: Perm) => ctx.perms.includes(p);
  const inScope = (ctx: AuthCtx, branchId?: string) => ctx.scope === null || (!!branchId && ctx.scope.includes(branchId));
  const wrap = (fn: (req: Request, res: Response) => Promise<any>) => (req: Request, res: Response) =>
    fn(req, res).catch((e: any) => res.status(500).json({ error: e.message }));
  const unscopedOnly = (res: Response) => {
    if (auth(res).scope !== null) { res.status(403).json({ error: "Only head-office users can do this." }); return false; }
    return true;
  };

  // brute-force brake (per server instance)
  const fails = new Map<string, { n: number; until: number }>();

  function mount(app: Express) {
    // ---- sign in ----
    app.post("/api/auth/user-login", wrap(async (req, res) => {
      if (!secret()) return res.status(503).json({ success: false, error: "Staff login is not set up. Add ADMIN_PASSWORD (or SESSION_SECRET) in the environment." });
      const username = clean(req.body?.username, 60).toLowerCase();
      const password = String(req.body?.password || "");
      const key = `${req.ip}|${username}`;
      const f = fails.get(key);
      if (f && f.until > Date.now() && f.n >= 5) return res.status(429).json({ success: false, error: "Too many attempts. Try again in 15 minutes." });
      const u = (await users()).find(x => x.username.toLowerCase() === username);
      if (!u || !u.active || !checkPassword(password, u.passwordHash)) {
        fails.set(key, { n: (f && f.until > Date.now() ? f.n : 0) + 1, until: Date.now() + 15 * 60e3 });
        return res.status(401).json({ success: false, error: "Incorrect username or password." });
      }
      fails.delete(key);
      u.lastLogin = new Date().toISOString();
      await d.setContent("users", (await users()).map(x => (x.id === u.id ? u : x)));
      await audit({ id: u.id, name: u.name, role: u.role }, "Signed in");
      res.json({ success: true, token: sign(u) });
    }));

    app.get("/api/auth/me", guard(), wrap(async (req, res) => {
      const a = auth(res);
      res.json({ id: a.id, name: a.name, role: a.role, roleLabel: ROLES[a.role], perms: a.perms, scope: a.scope, legacy: !!a.legacy });
    }));

    app.post("/api/auth/change-password", guard(), wrap(async (req, res) => {
      const a = auth(res);
      if (a.legacy) return res.status(400).json({ error: "The CEO password is changed in the ADMIN_PASSWORD environment variable." });
      const { current, next } = req.body || {};
      const list = await users();
      const u = list.find(x => x.id === a.id);
      if (!u || !checkPassword(String(current || ""), u.passwordHash)) return res.status(400).json({ error: "Current password is incorrect." });
      if (String(next || "").length < 8) return res.status(400).json({ error: "Use at least 8 characters." });
      u.passwordHash = hashPassword(String(next));
      await d.setContent("users", list);
      res.json({ success: true, token: sign(u) });
    }));

    // ---- users & permissions (CEO only) ----
    const ceoOnly = guard("users");
    app.get("/api/portal/meta", guard(), (_req, res) => res.json({ roles: ROLES, perms: PERMS, roleDefaults: ROLE_DEFAULTS, ceoOnly: CEO_ONLY }));

    app.get("/api/portal/users", ceoOnly, wrap(async (_req, res) => res.json((await users()).map(publicUser))));

    const readUserBody = (b: any, existing?: PortalUser) => {
      const role: Role = b.role in ROLES ? b.role : existing?.role || "sales";
      const perms: Perm[] | undefined = Array.isArray(b.perms) ? (b.perms.filter((p: string) => p in PERMS) as Perm[]) : existing?.perms;
      return {
        name: clean(b.name ?? existing?.name, 80), username: clean(b.username ?? existing?.username, 40).toLowerCase(),
        email: clean(b.email ?? existing?.email), phone: clean(b.phone ?? existing?.phone, 20), role,
        branchIds: Array.isArray(b.branchIds) ? b.branchIds.map((x: any) => clean(x, 60)) : existing?.branchIds || [],
        perms, active: b.active === undefined ? existing?.active ?? true : !!b.active,
      };
    };

    app.post("/api/portal/users", ceoOnly, wrap(async (req, res) => {
      const f = readUserBody(req.body || {});
      const pw = String(req.body?.password || "");
      if (f.name.length < 2 || !/^[a-z0-9._-]{3,}$/.test(f.username)) return res.status(400).json({ error: "Enter a name and a username (3+ letters, numbers, dot or dash)." });
      if (pw.length < 8) return res.status(400).json({ error: "The first password needs at least 8 characters." });
      if (f.role === "franchise" && !f.branchIds.length) return res.status(400).json({ error: "A franchise partner must be linked to at least one branch." });
      const list = await users();
      if (list.some(u => u.username === f.username)) return res.status(400).json({ error: "That username is already taken." });
      const user: PortalUser = { id: uid("usr"), ...f, passwordHash: hashPassword(pw), createdAt: new Date().toISOString() };
      await d.setContent("users", [...list, user]);
      await audit(auth(res), "User created", `${user.name} (${ROLES[user.role]})`);
      res.json({ success: true, user: publicUser(user) });
    }));

    app.put("/api/portal/users/:id", ceoOnly, wrap(async (req, res) => {
      const list = await users();
      const u = list.find(x => x.id === req.params.id);
      if (!u) return res.status(404).json({ error: "User not found." });
      const f = readUserBody(req.body || {}, u);
      if (f.username !== u.username && list.some(x => x.username === f.username)) return res.status(400).json({ error: "That username is already taken." });
      if (f.role === "franchise" && !f.branchIds.length) return res.status(400).json({ error: "A franchise partner must be linked to at least one branch." });
      Object.assign(u, f);
      let note = "";
      if (req.body?.password) {
        if (String(req.body.password).length < 8) return res.status(400).json({ error: "Use at least 8 characters." });
        u.passwordHash = hashPassword(String(req.body.password)); // also signs the user out everywhere
        note = " · password reset";
      }
      await d.setContent("users", list);
      await audit(auth(res), "User updated", `${u.name} (${ROLES[u.role]})${u.active ? "" : " · deactivated"}${note}`);
      res.json({ success: true, user: publicUser(u) });
    }));

    // ---- branches ----
    app.get("/api/portal/branches", guard(), wrap(async (_req, res) => {
      const a = auth(res);
      const list = ((await d.getContent<any[]>("branches")) || []).filter(b => a.scope === null || a.scope.includes(b.id));
      res.json(list);
    }));
    app.post("/api/portal/branches", guard("users", "finance"), wrap(async (req, res) => {
      if (!unscopedOnly(res)) return;
      const name = clean(req.body?.name, 80);
      if (name.length < 2) return res.status(400).json({ error: "Enter the branch name." });
      const b = { id: uid("br"), name, city: clean(req.body?.city, 60), partner: clean(req.body?.partner, 80), active: true, createdAt: new Date().toISOString() };
      await d.setContent("branches", [...(((await d.getContent<any[]>("branches")) || [])), b]);
      res.json({ success: true, branch: b });
    }));
    app.put("/api/portal/branches/:id", guard("users", "finance"), wrap(async (req, res) => {
      if (!unscopedOnly(res)) return;
      const list = ((await d.getContent<any[]>("branches")) || []) as any[];
      const b = list.find(x => x.id === req.params.id);
      if (!b) return res.status(404).json({ error: "Branch not found." });
      for (const k of ["name", "city", "partner"]) if (req.body?.[k] !== undefined) b[k] = clean(req.body[k], 80);
      if (req.body?.active !== undefined) b.active = !!req.body.active;
      await d.setContent("branches", list);
      res.json({ success: true, branch: b });
    }));

    // ---- staff ----
    const staffGuard = guard("attendance", "salary");
    const staffView = (ctx: AuthCtx, s: any) => { const { monthlySalary, ...rest } = s; return can(ctx, "salary") ? s : rest; };
    app.get("/api/portal/staff", staffGuard, wrap(async (_req, res) => {
      const a = auth(res);
      const list = ((await d.getContent<any[]>("staff")) || []).filter(s => inScope(a, s.branchId));
      res.json(list.map(s => staffView(a, s)));
    }));
    app.post("/api/portal/staff", guard("attendance"), wrap(async (req, res) => {
      const a = auth(res);
      const branchId = clean(req.body?.branchId, 60);
      if (!inScope(a, branchId) && !(a.scope === null && !branchId)) return res.status(403).json({ error: "You can only add staff to your own branch." });
      const name = clean(req.body?.name, 80);
      if (name.length < 2) return res.status(400).json({ error: "Enter the staff member's name." });
      const s: any = { id: uid("stf"), name, designation: clean(req.body?.designation, 60), branchId, phone: clean(req.body?.phone, 20), active: true, createdAt: new Date().toISOString() };
      if (can(a, "salary")) s.monthlySalary = num(req.body?.monthlySalary);
      await d.setContent("staff", [...(((await d.getContent<any[]>("staff")) || [])), s]);
      res.json({ success: true, staff: staffView(a, s) });
    }));
    app.put("/api/portal/staff/:id", guard("attendance"), wrap(async (req, res) => {
      const a = auth(res);
      const list = ((await d.getContent<any[]>("staff")) || []) as any[];
      const s = list.find(x => x.id === req.params.id);
      if (!s || !inScope(a, s.branchId)) return res.status(404).json({ error: "Staff member not found." });
      for (const k of ["name", "designation", "phone"]) if (req.body?.[k] !== undefined) s[k] = clean(req.body[k], 80);
      if (req.body?.active !== undefined) s.active = !!req.body.active;
      if (req.body?.monthlySalary !== undefined && can(a, "salary")) s.monthlySalary = num(req.body.monthlySalary);
      if (req.body?.branchId !== undefined && inScope(a, clean(req.body.branchId, 60))) s.branchId = clean(req.body.branchId, 60);
      await d.setContent("staff", list);
      res.json({ success: true, staff: staffView(a, s) });
    }));

    // ---- attendance ----
    const STATUSES = ["present", "absent", "leave", "half"];
    app.get("/api/portal/attendance", guard("attendance"), wrap(async (req, res) => {
      const a = auth(res);
      const q = clean(req.query.date || req.query.month, 10);
      const rows = ((await d.getContent<any[]>("attendance")) || []).filter(r => inScope(a, r.branchId) && (!q || r.date.startsWith(q)));
      res.json(rows);
    }));
    app.put("/api/portal/attendance", guard("attendance"), wrap(async (req, res) => {
      const a = auth(res);
      const date = clean(req.body?.date, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > today()) return res.status(400).json({ error: "Choose a valid date (not in the future)." });
      const entries = Array.isArray(req.body?.entries) ? req.body.entries : [];
      const staff = ((await d.getContent<any[]>("staff")) || []) as any[];
      const rows = ((await d.getContent<any[]>("attendance")) || []) as any[];
      let saved = 0;
      for (const e of entries) {
        const s = staff.find(x => x.id === e.staffId);
        if (!s || !inScope(a, s.branchId) || !STATUSES.includes(e.status)) continue;
        const id = `${date}_${s.id}`;
        const row = { id, date, staffId: s.id, branchId: s.branchId, status: e.status, note: clean(e.note, 120), by: a.name };
        const i = rows.findIndex(r => r.id === id);
        if (i === -1) rows.push(row); else rows[i] = row;
        saved++;
      }
      await d.setContent("attendance", rows);
      await audit(a, "Attendance saved", `${date} · ${saved} staff`);
      res.json({ success: true, saved });
    }));

    // ---- payslips ----
    app.get("/api/portal/payslips", guard("salary"), wrap(async (req, res) => {
      const a = auth(res);
      const month = clean(req.query.month, 7);
      res.json(((await d.getContent<any[]>("payslips")) || []).filter(p => inScope(a, p.branchId) && (!month || p.month === month)));
    }));
    app.post("/api/portal/payslips", guard("salary"), wrap(async (req, res) => {
      const a = auth(res);
      const staff = ((await d.getContent<any[]>("staff")) || []).find(s => s.id === req.body?.staffId);
      const month = clean(req.body?.month, 7);
      if (!staff || !inScope(a, staff.branchId) || !/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: "Choose a staff member and month." });
      const basic = num(req.body?.basic ?? staff.monthlySalary), allowances = num(req.body?.allowances), deductions = num(req.body?.deductions);
      const list = ((await d.getContent<any[]>("payslips")) || []) as any[];
      const slip: any = {
        id: `${month}_${staff.id}`, staffId: staff.id, staffName: staff.name, branchId: staff.branchId, month, basic, allowances, deductions,
        net: Math.max(0, basic + allowances - deductions), status: req.body?.status === "paid" ? "paid" : "pending",
        paidOn: req.body?.status === "paid" ? clean(req.body?.paidOn, 10) || today() : "", note: clean(req.body?.note, 160), updatedBy: a.name,
      };
      const i = list.findIndex(p => p.id === slip.id);
      if (i === -1) list.push(slip); else list[i] = slip;
      await d.setContent("payslips", list);
      res.json({ success: true, payslip: slip });
    }));

    // ---- event photographs ----
    app.get("/api/gallery", wrap(async (_req, res) => {
      res.json(((await d.getContent<any[]>("gallery")) || []).filter(g => g.status === "approved").map(({ id, title, url, date, branchId }) => ({ id, title, url, date, branchId })));
    }));
    app.get("/api/portal/gallery", guard("gallery"), wrap(async (_req, res) => {
      const a = auth(res);
      res.json(((await d.getContent<any[]>("gallery")) || []).filter(g => inScope(a, g.branchId)));
    }));
    app.post("/api/portal/gallery", guard("gallery"), wrap(async (req, res) => {
      const a = auth(res);
      const branchId = clean(req.body?.branchId, 60);
      const url = clean(req.body?.url, 600);
      if (!/^https:\/\//.test(url) || clean(req.body?.title).length < 2) return res.status(400).json({ error: "Add a title and upload a photo first." });
      if (!inScope(a, branchId) && !(a.scope === null && !branchId)) return res.status(403).json({ error: "You can only upload for your own branch." });
      // Staff uploads wait for approval before anything can be published on the website
      const g = { id: uid("img"), title: clean(req.body?.title, 100), url, branchId, date: clean(req.body?.date, 10) || today(), status: "pending", uploadedBy: a.name, createdAt: new Date().toISOString() };
      await d.setContent("gallery", [g, ...(((await d.getContent<any[]>("gallery")) || []))]);
      res.json({ success: true, photo: g });
    }));
    app.put("/api/portal/gallery/:id", guard("website"), wrap(async (req, res) => {
      const list = ((await d.getContent<any[]>("gallery")) || []) as any[];
      const g = list.find(x => x.id === req.params.id);
      if (!g) return res.status(404).json({ error: "Photo not found." });
      if (["approved", "rejected", "pending"].includes(req.body?.status)) g.status = req.body.status;
      await d.setContent("gallery", list);
      res.json({ success: true, photo: g });
    }));
    app.delete("/api/portal/gallery/:id", guard("gallery"), wrap(async (req, res) => {
      const a = auth(res);
      const list = ((await d.getContent<any[]>("gallery")) || []) as any[];
      const g = list.find(x => x.id === req.params.id);
      if (!g || !inScope(a, g.branchId)) return res.status(404).json({ error: "Photo not found." });
      if (g.status === "approved" && !can(a, "website")) return res.status(403).json({ error: "Approved photos can only be removed by the head office." });
      await d.setContent("gallery", list.filter(x => x.id !== g.id));
      res.json({ success: true });
    }));

    // ---- branch ledger (payment history & receipts) ----
    app.get("/api/portal/ledger", guard("finance"), wrap(async (_req, res) => {
      const a = auth(res);
      res.json(((await d.getContent<any[]>("ledger")) || []).filter(l => inScope(a, l.branchId)));
    }));
    app.post("/api/portal/ledger", guard("finance"), wrap(async (req, res) => {
      if (!unscopedOnly(res)) return;
      const amount = num(req.body?.amount);
      const branchId = clean(req.body?.branchId, 60);
      if (!branchId || amount <= 0) return res.status(400).json({ error: "Choose a branch and enter the amount." });
      const l = {
        id: uid("led"), branchId, date: clean(req.body?.date, 10) || today(), amount, kind: clean(req.body?.kind, 40) || "Payment",
        reference: clean(req.body?.reference, 80), status: req.body?.status === "pending" ? "pending" : "received",
        receiptUrl: /^https:\/\//.test(String(req.body?.receiptUrl || "")) ? clean(req.body.receiptUrl, 600) : "", note: clean(req.body?.note, 160), by: auth(res).name,
      };
      await d.setContent("ledger", [l, ...(((await d.getContent<any[]>("ledger")) || []))]);
      res.json({ success: true, entry: l });
    }));
    app.delete("/api/portal/ledger/:id", guard("finance"), wrap(async (req, res) => {
      if (!unscopedOnly(res)) return;
      await d.setContent("ledger", ((await d.getContent<any[]>("ledger")) || []).filter((l: any) => l.id !== req.params.id));
      res.json({ success: true });
    }));

    // ---- notices ----
    app.get("/api/portal/notices", guard(), wrap(async (_req, res) => {
      const a = auth(res);
      res.json(((await d.getContent<any[]>("notices")) || []).filter(n => !n.branchId || inScope(a, n.branchId)));
    }));
    app.post("/api/portal/notices", guard("notices"), wrap(async (req, res) => {
      if (!unscopedOnly(res)) return;
      const title = clean(req.body?.title, 120);
      if (title.length < 3) return res.status(400).json({ error: "Add a title." });
      const n = { id: uid("ntc"), title, body: clean(req.body?.body, 1000), branchId: clean(req.body?.branchId, 60), at: new Date().toISOString(), by: auth(res).name };
      await d.setContent("notices", [n, ...(((await d.getContent<any[]>("notices")) || []))]);
      res.json({ success: true, notice: n });
    }));
    app.delete("/api/portal/notices/:id", guard("notices"), wrap(async (req, res) => {
      if (!unscopedOnly(res)) return;
      await d.setContent("notices", ((await d.getContent<any[]>("notices")) || []).filter((n: any) => n.id !== req.params.id));
      res.json({ success: true });
    }));

    // ---- activity log ----
    app.get("/api/portal/audit", guard("audit"), wrap(async (req, res) => {
      const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 200));
      res.json(((await d.getContent<any[]>("audit")) || []).slice(0, limit));
    }));

    // ---- management overview: each block is only returned to people allowed to see it ----
    app.get("/api/portal/overview", guard("reports"), wrap(async (_req, res) => {
      const a = auth(res);
      const out: any = { generatedAt: new Date().toISOString(), role: a.role };
      const t = today();
      const day = (iso?: string) => new Date(new Date(iso || 0).getTime() + IST).toISOString().slice(0, 10);

      if (can(a, "leads")) {
        const leads = await d.getEnquiries();
        const since = (n: number) => new Date(Date.now() + IST - n * 864e5).toISOString().slice(0, 10);
        const by = (f: (l: any) => string) => leads.reduce((m: any, l) => { const k = f(l) || "Unknown"; m[k] = (m[k] || 0) + 1; return m; }, {});
        const category = (l: any) => categoryInfo(enquiryCategory(l.type, l.fields)).short; // same buckets as the CRM
        const open = leads.filter(l => l.status !== "admission" && l.status !== "lost");
        const trend: Record<string, number> = {};
        for (let i = 13; i >= 0; i--) trend[since(i)] = 0;
        leads.forEach(l => { const k = day(l.createdAt); if (k in trend) trend[k]++; });
        const admitted = leads.filter(l => l.status === "admission").length;
        out.leads = {
          total: leads.length, last30: leads.filter(l => day(l.createdAt) >= since(30)).length, open: open.length, admitted,
          conversionPct: leads.length ? Math.round((admitted / leads.length) * 100) : 0,
          followUpsDue: open.filter(l => l.nextFollowUp && String(l.nextFollowUp).slice(0, 10) <= t).length,
          unassigned: open.filter(l => !l.fields?.assignedTo).length,
          byStage: by(l => l.status), byCategory: by(l => category(l)), bySource: by(l => l.fields?.source || "Website"),
          trend: Object.entries(trend).map(([date, count]) => ({ date, count })),
        };
      }
      if (can(a, "payments")) {
        const pays = await d.listPayments();
        const ok = pays.filter(p => p.status === "verified");
        out.payments = {
          verifiedCount: ok.length, verifiedTotal: ok.reduce((s, p) => s + num(p.amount), 0),
          pendingCount: pays.filter(p => p.status === "pending_verification").length,
          last30Total: ok.filter(p => day(p.createdAt) >= new Date(Date.now() + IST - 30 * 864e5).toISOString().slice(0, 10)).reduce((s, p) => s + num(p.amount), 0),
        };
      }
      const staff = ((await d.getContent<any[]>("staff")) || []).filter(s => s.active !== false && inScope(a, s.branchId));
      if (can(a, "attendance")) {
        const marks = ((await d.getContent<any[]>("attendance")) || []).filter(r => r.date === t && inScope(a, r.branchId));
        const c = (s: string) => marks.filter(m => m.status === s).length;
        out.staff = { total: staff.length, present: c("present") + c("half"), absent: c("absent"), onLeave: c("leave"), unmarked: Math.max(0, staff.length - marks.length) };
      }
      if (can(a, "salary")) {
        const month = t.slice(0, 7);
        const slips = ((await d.getContent<any[]>("payslips")) || []).filter(p => p.month === month && inScope(a, p.branchId));
        out.salary = {
          month, monthlyBill: staff.reduce((s, x) => s + num(x.monthlySalary), 0),
          paid: slips.filter(p => p.status === "paid").reduce((s, p) => s + p.net, 0), slipsPending: slips.filter(p => p.status !== "paid").length,
        };
      }
      if (can(a, "website")) {
        out.approvals = { photos: ((await d.getContent<any[]>("gallery")) || []).filter(g => g.status === "pending").length };
      }
      out.branches = ((await d.getContent<any[]>("branches")) || []).filter(b => b.active !== false && inScope(a, b.id)).length;
      if (can(a, "audit")) out.recent = ((await d.getContent<any[]>("audit")) || []).slice(0, 8);
      res.json(out);
    }));
  }

  return { mount, guard, authenticate, audit, ROLES };
}
