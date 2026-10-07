import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Copy, Eye, EyeOff, Star, ArrowUp, ArrowDown, Upload, X, ExternalLink, ImagePlus } from 'lucide-react';
import type { Opportunity, OpportunityRow } from '../../types';
import { input, btn, btnPrimary, btnGhost, card, useList, Toolbar, Field, type TabProps } from './ui';

// Admin: add, edit, delete, publish and order the listings on the Joint Ventures page.
const STATUSES = ['Open for partnership', 'Under discussion', 'Coming soon', 'Closed'];

const EMPTY: Opportunity = {
  id: '', title: '', location: '', category: 'Land / Development', status: 'Open for partnership', featured: false, published: false, order: 0,
  headline: '', summary: '', area: '', investmentRequirement: '', partnershipModel: '', potential: '', timeline: '',
  overview: [], details: [], detailsNote: '', terms: [], termsNote: '', development: [], partnershipOptions: [], images: [],
  mapUrl: '', contactPhone: '', documents: '', eligibility: '', disclaimer: '',
};

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1]);
  r.onerror = reject;
  r.readAsDataURL(file);
});

// Paragraph lists are edited as text with a blank line between paragraphs
const toText = (ps: string[]) => ps.join('\n\n');
const toParas = (t: string) => t.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

export const OpportunitiesTab: React.FC<TabProps> = ({ api, flash }) => {
  const { items, loading, reload } = useList<Opportunity>(api, '/api/opportunities');
  const [editing, setEditing] = useState<Opportunity | null>(null);

  const save = async (o: Opportunity) => {
    const { id, ...body } = o;
    await api(id ? `/api/opportunities/${id}` : '/api/opportunities', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    flash('Opportunity saved');
    setEditing(null);
    reload();
  };
  const patch = async (o: Opportunity, p: Partial<Opportunity>, msg: string) => {
    await api(`/api/opportunities/${o.id}`, { method: 'PUT', body: JSON.stringify(p) });
    flash(msg);
    reload();
  };
  const remove = async (o: Opportunity) => {
    if (!confirm(`Delete "${o.title}" permanently?`)) return;
    await api(`/api/opportunities/${o.id}`, { method: 'DELETE' });
    flash('Opportunity deleted');
    reload();
  };
  const move = async (i: number, d: number) => {
    const a = items[i], b = items[i + d];
    if (!a || !b) return;
    await api(`/api/opportunities/${a.id}`, { method: 'PUT', body: JSON.stringify({ order: b.order || i + d + 1 }) });
    await api(`/api/opportunities/${b.id}`, { method: 'PUT', body: JSON.stringify({ order: a.order || i + 1 }) });
    reload();
  };

  if (editing) return <Editor initial={editing} api={api} onCancel={() => setEditing(null)} onSave={save} />;

  return (
    <section className="space-y-4">
      <Toolbar title="Opportunities" count={items.length} onReload={reload}>
        <a className={btnGhost} href="/joint-ventures" target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> View page</a>
        <button className={btnPrimary} onClick={() => setEditing({ ...EMPTY, order: items.length + 1 })}><Plus className="h-4 w-4" /> New opportunity</button>
      </Toolbar>
      <p className="text-xs text-stone-500">
        Listings appear on Partner With Us → Joint Ventures. Only <strong>published</strong> listings are visible to visitors; the <strong>featured</strong> one is shown large near the top.
      </p>

      {loading ? <p className="text-sm text-stone-500">Loading…</p> : (
        <div className="space-y-3">
          {items.map((o, i) => (
            <div key={o.id} className={`${card} flex flex-col gap-4 sm:flex-row sm:items-center`}>
              <img src={o.images[0]?.url || '/arcadia/arcadia_hero.jpg'} alt="" className="h-28 w-full shrink-0 rounded-xl object-cover sm:h-20 sm:w-32" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-stone-900">{o.title}</span>
                  {o.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800"><Star className="h-3 w-3" /> Featured</span>}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${o.published ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}`}>{o.published ? 'Published' : 'Draft'}</span>
                </div>
                <div className="truncate text-sm text-stone-500">{o.location} · {o.category} · {o.status}</div>
                <div className="text-xs text-stone-400">{o.images.length} photos</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button className={btnGhost} title="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></button>
                <button className={btnGhost} title="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></button>
                <button className={btnGhost} onClick={() => patch(o, { published: !o.published }, o.published ? 'Unpublished' : 'Published')}>
                  {o.published ? <><EyeOff className="h-4 w-4" /> Unpublish</> : <><Eye className="h-4 w-4" /> Publish</>}
                </button>
                {!o.featured && <button className={btnGhost} onClick={async () => {
                  // Only one featured listing at a time
                  for (const x of items.filter(x => x.featured)) await api(`/api/opportunities/${x.id}`, { method: 'PUT', body: JSON.stringify({ featured: false }) });
                  await patch(o, { featured: true }, 'Set as featured');
                }}><Star className="h-4 w-4" /> Feature</button>}
                <button className={btnGhost} onClick={() => setEditing(o)}><Pencil className="h-4 w-4" /> Edit</button>
                <button className={btnGhost} title="Duplicate as a new draft" onClick={() => setEditing({ ...o, id: '', title: `${o.title} (copy)`, published: false, featured: false, order: items.length + 1 })}><Copy className="h-4 w-4" /></button>
                <button className={`${btnGhost} text-red-600`} onClick={() => remove(o)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-sm text-stone-500">No opportunities yet. Click “New opportunity” to add one.</p>}
        </div>
      )}
    </section>
  );
};

// ---------------- Editor ----------------
const Section: React.FC<{ title: string; hint?: string; children: React.ReactNode }> = ({ title, hint, children }) => (
  <div className={`${card} space-y-4`}>
    <div>
      <h2 className="font-semibold text-stone-900">{title}</h2>
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
    {children}
  </div>
);

const RowsEditor: React.FC<{ rows: OpportunityRow[]; onChange: (r: OpportunityRow[]) => void; labelName?: string; valueName?: string }> = ({ rows, onChange, labelName = 'Label', valueName = 'Value' }) => (
  <div className="space-y-2">
    {rows.map((r, i) => (
      <div key={i} className="grid gap-2 sm:grid-cols-[12rem_1fr_auto]">
        <input className={input} placeholder={labelName} value={r.label} onChange={e => onChange(rows.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
        <textarea className={input} rows={1} placeholder={valueName} value={r.value} onChange={e => onChange(rows.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
        <div className="flex gap-1">
          <button type="button" className={btnGhost} disabled={i === 0} onClick={() => { const n = [...rows]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
          <button type="button" className={`${btnGhost} text-red-600`} onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label="Remove"><X className="h-4 w-4" /></button>
        </div>
      </div>
    ))}
    <button type="button" className={btnGhost} onClick={() => onChange([...rows, { label: '', value: '' }])}><Plus className="h-4 w-4" /> Add row</button>
  </div>
);

const Editor: React.FC<{ initial: Opportunity; api: TabProps['api']; onCancel: () => void; onSave: (o: Opportunity) => Promise<void> }> = ({ initial, api, onCancel, onSave }) => {
  const [o, setO] = useState<Opportunity>({ ...EMPTY, ...initial });
  const [overview, setOverview] = useState(toText(initial.overview || []));
  const [development, setDevelopment] = useState(toText(initial.development || []));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [err, setErr] = useState('');
  const set = <K extends keyof Opportunity>(k: K, v: Opportunity[K]) => setO(x => ({ ...x, [k]: v }));
  const text = (k: keyof Opportunity, label: string, opts: { area?: boolean; full?: boolean; placeholder?: string } = {}) => (
    <Field label={label} full={opts.full || opts.area}>
      {opts.area
        ? <textarea className={input} rows={2} placeholder={opts.placeholder} value={String(o[k] ?? '')} onChange={e => set(k, e.target.value as any)} />
        : <input className={input} placeholder={opts.placeholder} value={String(o[k] ?? '')} onChange={e => set(k, e.target.value as any)} />}
    </Field>
  );

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setErr('');
    const added: { url: string; caption: string }[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 3 * 1024 * 1024) { setErr(`${file.name} is over 3 MB. Please resize it and try again.`); continue; }
      setUploading(n => n + 1);
      try {
        const { url } = await api('/api/upload', { method: 'POST', body: JSON.stringify({ name: file.name, contentType: file.type, dataBase64: await toBase64(file), folder: 'opportunities' }) });
        added.push({ url, caption: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') });
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setUploading(n => n - 1);
      }
    }
    if (added.length) setO(x => ({ ...x, images: [...x.images, ...added] }));
  };
  const moveImg = (i: number, d: number) => setO(x => {
    const imgs = [...x.images];
    if (!imgs[i + d]) return x;
    [imgs[i], imgs[i + d]] = [imgs[i + d], imgs[i]];
    return { ...x, images: imgs };
  });

  const submit = async () => {
    if (!o.title.trim()) return setErr('Title is required.');
    setBusy(true);
    try {
      await onSave({ ...o, overview: toParas(overview), development: toParas(development) });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">{o.id ? 'Edit opportunity' : 'New opportunity'}</h1>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={onCancel}>Cancel</button>
          <button className={btnPrimary} disabled={busy || uploading > 0} onClick={submit}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>

      <Section title="Listing" hint="Shown on the opportunity card and at the top of the detail view.">
        <div className="grid gap-4 sm:grid-cols-2">
          {text('title', 'Title *', { placeholder: 'e.g. Whitefield Land Opportunity' })}
          {text('location', 'Location', { placeholder: 'e.g. EPIP Zone / Whitefield, Bengaluru – 560048' })}
          {text('category', 'Opportunity type', { placeholder: 'e.g. Land / Development' })}
          <Field label="Status">
            <select className={input} value={o.status} onChange={e => set('status', e.target.value)}>
              {[...new Set([o.status, ...STATUSES])].filter(Boolean).map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          {text('headline', 'Headline', { full: true, placeholder: 'e.g. 22,000 sq. ft. land for Build-to-Suit and development JV' })}
          {text('summary', 'Short summary (card text)', { area: true })}
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" className="h-4 w-4 accent-[#E1007A]" checked={o.published} onChange={e => set('published', e.target.checked)} /> Published (visible on the website)</label>
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" className="h-4 w-4 accent-[#E1007A]" checked={o.featured} onChange={e => set('featured', e.target.checked)} /> Featured (shown large at the top)</label>
        </div>
      </Section>

      <Section title="Photos" hint="The first photo is the cover. Upload JPG/PNG under 3 MB each; you can upload several at once.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {o.images.map((im, i) => (
            <div key={im.url + i} className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
              <div className="relative">
                <img src={im.url} alt="" className="h-28 w-full object-cover" />
                {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-[#E1007A] px-2 py-0.5 text-[10px] font-bold text-white">Cover</span>}
              </div>
              <div className="space-y-1.5 p-2">
                <input className={`${input} !py-1.5 !text-xs`} placeholder="Caption" value={im.caption} onChange={e => set('images', o.images.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))} />
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <button type="button" className={`${btn} !p-1.5 text-stone-600 hover:bg-stone-200`} disabled={i === 0} onClick={() => moveImg(i, -1)} aria-label="Move left"><ArrowUp className="h-3.5 w-3.5 -rotate-90" /></button>
                    <button type="button" className={`${btn} !p-1.5 text-stone-600 hover:bg-stone-200`} disabled={i === o.images.length - 1} onClick={() => moveImg(i, 1)} aria-label="Move right"><ArrowDown className="h-3.5 w-3.5 -rotate-90" /></button>
                  </div>
                  <button type="button" className={`${btn} !p-1.5 text-red-600 hover:bg-red-50`} onClick={() => set('images', o.images.filter((_, j) => j !== i))} aria-label="Remove photo"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
          <label className="flex min-h-[10rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 text-sm font-semibold text-stone-500 hover:border-[#E1007A] hover:text-[#E1007A]">
            {uploading ? <>Uploading {uploading}…</> : <><ImagePlus className="h-6 w-6" /> Upload photos</>}
            <input type="file" accept="image/*" multiple className="hidden" onChange={e => { upload(e.target.files); e.target.value = ''; }} />
          </label>
        </div>
        <div className="flex gap-2">
          <input id="opp-img-url" className={input} placeholder="…or paste an image URL" />
          <button type="button" className={btnGhost} onClick={() => {
            const el = document.getElementById('opp-img-url') as HTMLInputElement;
            if (el.value.trim()) { set('images', [...o.images, { url: el.value.trim(), caption: '' }]); el.value = ''; }
          }}><Upload className="h-4 w-4" /> Add</button>
        </div>
      </Section>

      <Section title="Key facts" hint="Shown in the featured panel. Leave a field empty to show “Shared on request”. Only enter verified figures.">
        <div className="grid gap-4 sm:grid-cols-2">
          {text('area', 'Land area')}
          {text('investmentRequirement', 'Investment requirement')}
          {text('partnershipModel', 'Partnership model', { area: true })}
          {text('potential', 'Opportunity / potential', { area: true })}
          {text('timeline', 'Timeline')}
        </div>
      </Section>

      <Section title="The opportunity" hint="Separate paragraphs with a blank line.">
        <textarea className={input} rows={7} value={overview} onChange={e => setOverview(e.target.value)} />
      </Section>

      <Section title="Land & property details">
        <RowsEditor rows={o.details} onChange={r => set('details', r)} />
        {text('detailsNote', 'Note below the table', { area: true })}
      </Section>

      <Section title="Indicative commercial terms">
        <RowsEditor rows={o.terms} onChange={r => set('terms', r)} />
        {text('termsNote', 'Note below the table', { area: true })}
      </Section>

      <Section title="Development potential" hint="Separate paragraphs with a blank line.">
        <textarea className={input} rows={6} value={development} onChange={e => setDevelopment(e.target.value)} />
      </Section>

      <Section title="Partnership options">
        <RowsEditor rows={o.partnershipOptions} onChange={r => set('partnershipOptions', r)} labelName="Option (e.g. Development JV)" valueName="Description" />
      </Section>

      <Section title="Location, contact & documents">
        <div className="grid gap-4 sm:grid-cols-2">
          {text('mapUrl', 'Google Maps link', { placeholder: 'https://maps.app.goo.gl/…' })}
          {text('contactPhone', 'Contact WhatsApp number')}
          {text('eligibility', 'Investor eligibility', { area: true })}
          {text('documents', 'Available documentation', { area: true })}
          {text('disclaimer', 'Disclaimer', { area: true })}
        </div>
      </Section>

      {err && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>}
      <div className="flex justify-end gap-2 pb-8">
        <button className={btnGhost} onClick={onCancel}>Cancel</button>
        <button className={btnPrimary} disabled={busy || uploading > 0} onClick={submit}>{busy ? 'Saving…' : 'Save opportunity'}</button>
      </div>
    </section>
  );
};
