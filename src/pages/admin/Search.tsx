import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, CornerDownLeft, User } from 'lucide-react';
import type { Enquiry } from '../../types';
import type { Api } from './ui';

// Ctrl/⌘+K search: jump to any section, or find a lead by name, phone or email.
// A lead opens "All enquiries" filtered to that person.
interface Section { id: string; label: string; description: string; group: string; icon: React.ElementType }

export const SearchPalette: React.FC<{ api: Api; sections: Section[]; canSearchLeads: boolean; onGo: (target: string) => void; onClose: () => void }> = ({ api, sections, canSearchLeads, onGo, onClose }) => {
  const [q, setQ] = useState('');
  const [leads, setLeads] = useState<Enquiry[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { if (canSearchLeads) api('/api/enquiries').then(d => setLeads(Array.isArray(d) ? d : [])).catch(() => {}); }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    const digits = t.replace(/\D/g, '');
    const secs = sections
      .filter(s => !t || `${s.label} ${s.description} ${s.group}`.toLowerCase().includes(t))
      .map(s => ({ key: `s-${s.id}`, target: s.id, title: s.label, sub: s.group, icon: s.icon }));
    const people = t.length < 2 ? [] : leads
      .filter(e => [e.fields?.name, e.fields?.email].some(v => String(v || '').toLowerCase().includes(t)) || (digits.length >= 3 && String(e.fields?.phone || '').replace(/\D/g, '').includes(digits)))
      .slice(0, 6)
      .map(e => ({ key: `l-${e.id}`, target: `enquiries:${e.fields?.phone || e.fields?.email || e.fields?.name || ''}`, title: e.fields?.name || e.fields?.email || 'Lead', sub: [e.fields?.phone, e.fields?.enquiryType].filter(Boolean).join(' · '), icon: User }));
    return [...people, ...secs];
  }, [q, leads, sections]);

  useEffect(() => setActive(0), [q]);

  const choose = (i: number) => { const r = results[i]; if (r) { onGo(r.target); onClose(); } };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-2 border-b border-slate-200 px-3.5">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(results.length - 1, a + 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
              else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
              else if (e.key === 'Escape') onClose();
            }}
            placeholder={canSearchLeads ? 'Search leads by name, phone or email, or a section…' : 'Go to a section…'}
            aria-label="Search" className="h-12 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none" />
          <kbd className="hidden rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:block">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-1.5" role="listbox">
          {results.map((r, i) => (
            <li key={r.key} role="option" aria-selected={i === active}>
              <button onMouseEnter={() => setActive(i)} onClick={() => choose(i)}
                className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm cursor-pointer ${i === active ? 'bg-slate-100' : ''}`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500"><r.icon className="h-3.5 w-3.5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-slate-900">{r.title}</span>
                  {r.sub && <span className="block truncate text-xs text-slate-500">{r.sub}</span>}
                </span>
                {i === active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
              </button>
            </li>
          ))}
          {!results.length && <li className="px-3 py-6 text-center text-sm text-slate-500">No matches for “{q}”.</li>}
        </ul>
      </div>
    </div>
  );
};
