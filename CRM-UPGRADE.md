# KinderBee CRM upgrade: what is built

Built on the existing admin and CRM (nothing removed). Follows the CRM Upgrade Proposal, phases 2 to 4.

## Sign-in
- **CEO tab**: the existing `ADMIN_PASSWORD`. This is the CEO / Super Admin account.
- **Staff / Partner tab**: accounts the CEO creates under *Team & access*. Passwords are hashed (scrypt), tokens expire after 12 hours, and 5 wrong attempts lock that username for 15 minutes.

## Roles (CEO can override any permission per person)
| Role | Default access |
|---|---|
| CEO / Super Admin | Everything, including users, permissions and the activity log |
| Admin | Dashboard, leads, payments, opportunities, website, staff and attendance, photos, branch payments, notices (no salary, users or log) |
| Teacher Admin | Attendance, salary and payslips, event photos |
| Sales & Marketing | Dashboard, leads (lead desk, assignment, follow-ups) |
| Franchise Partner | Own branch only: staff, attendance, salary, photos, payment history and receipts, notices, read-only branch leads |

Rules are enforced in `server/portal.ts` on every API request. Permissions are re-read on each request, so removing access works immediately.

## New screens (admin panel)
Overview (CEO dashboard), Lead desk (assign owner and branch), Staff & payroll (attendance, staff, payslips), Event photos (upload, approve), Branch payments (ledger, receipts, notices), Team & access, Activity log.

## Storage
Uses the existing `site_data` table (Supabase) or `db.json` locally. No migration needed. New keys: users, branches, staff, attendance, payslips, gallery, ledger, notices, audit.
`GET /api/gallery` returns approved event photos for a future "Life at KinderBee" section; it is not wired into the public site yet.

## Not built yet (needs access or decisions from KinderBee)
- WhatsApp Business, Meta lead forms and Razorpay: need API credentials and approvals. Branch payments are recorded manually for now.
- Call logging and telephony; replying to messages from the CRM.
- Backups and rollback plan, and a technical audit of the live database (proposal phases 1 and 6).
- Set `ADMIN_PASSWORD` (and ideally `SESSION_SECRET`) in Vercel before using staff logins.
