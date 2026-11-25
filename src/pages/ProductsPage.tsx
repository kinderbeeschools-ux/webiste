import React from 'react';
import {
  ArrowRight, ChevronDown, Layers, BookOpen, LayoutGrid, Contact, HeartHandshake, GraduationCap, Network,
  Building2, Users, UserCheck, Baby, Handshake
} from 'lucide-react';
import { SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';

interface Props {
  onOpenConsultation: (type?: string) => void;
  settings?: SystemSettings | null;
}

const label = 'text-[11px] font-bold uppercase tracking-wider';
const H2 = 'text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#252323] leading-tight';
const wrap = 'max-w-7xl mx-auto px-4 sm:px-8 lg:px-12';

const ONE_MODULES = ['Curriculum Studio', 'Learning Modules', 'Child Development Matrix', 'Educator Resources', 'Family Connect', 'Partner 360'];
const OS_MODULES = ['Dashboard Analytics', 'Admissions Overview', 'Student Statistics', 'Attendance Tracking', 'Fee Management', 'Staff Management'];

const ONE_FEATURES = [
  { icon: BookOpen, t: 'Curriculum Studio', d: 'Structured Finnish-inspired modules and daily classroom activity plans.' },
  { icon: LayoutGrid, t: 'KIPS Whole-Child Growth Matrix', d: 'Holistic observation across six foundational early-years development areas.' },
  { icon: Contact, t: 'School CRM', d: 'Organized enquiry follow-ups and campus tour scheduling for partners.' },
  { icon: HeartHandshake, t: 'Family Connect', d: 'Transparent milestone sharing and meaningful parent-teacher communication.' },
  { icon: GraduationCap, t: 'Educator Academy', d: 'Continuous teacher training resources and classroom facilitation guides.' },
  { icon: Network, t: 'Partner 360', d: 'End-to-end campus launch kits, brand guidelines, and mentorship access.' },
];

const PROGRAMMES = [
  { t: 'Smarties', bg: 'bg-[#FFECF0]' }, { t: 'Questers', bg: 'bg-[#FFF7CC]' },
  { t: 'Thinkers', bg: 'bg-[#FFEDEA]' }, { t: 'Achievers', bg: 'bg-[#FFEDE5]' },
];

const OS_SIDEBAR = ['Overview', 'Admissions', 'Students', 'Attendance', 'Fees', 'Staff', 'Academics', 'Communication', 'Transport', 'Inventory', 'Finance', 'Reports', 'Settings'];

const AUDIENCES = [
  { icon: Building2, t: 'Preschool Owners' }, { icon: Users, t: 'Administrators' }, { icon: UserCheck, t: 'Educators' },
  { icon: Baby, t: 'Parents' }, { icon: Handshake, t: 'Education Partners' },
];

const FAQS = [
  { q: 'What is KinderBee ONE?', a: 'KinderBee ONE is our complete early-years education ecosystem uniting Curriculum Studio, KIPS Whole-Child Growth Matrix, Educator Academy, Family Connect, and Partner 360.' },
  { q: 'What is KinderOS?', a: 'KinderOS is the smart operating system for preschools, managing admissions, student records, attendance, fees, staff, transport, inventory, and reporting.' },
  { q: 'What is the difference?', a: 'KinderBee ONE focuses on pedagogy, curriculum, child development, and educator/family engagement, while KinderOS focuses on daily school operations and administration.' },
  { q: 'Can I use both products?', a: 'Yes, schools and partners can adopt either product independently or both together as complementary systems.' },
  { q: 'Who can use KinderBee ONE?', a: 'Preschool founders, educators, school administrators, families, and institutional education partners.' },
  { q: 'What modules are available?', a: 'KinderBee ONE includes 6 core pillars; KinderOS includes 12+ operational modules from Admissions and Attendance to Finance and Analytics.' },
  { q: 'How do I request a demo?', a: 'Use the Request Demo buttons on this page, select KinderBee ONE, KinderOS, or both, and our product team will schedule a walkthrough.' },
];

export const ProductsPage: React.FC<Props> = ({ onOpenConsultation, settings }) => {
  const demo = () => onOpenConsultation('franchise');
  const cta = 'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-bold transition cursor-pointer';

  return (
    <div>
      <SEOHead
        title="KinderBee ONE & KinderOS – Preschool Digital Products | Kinderbee"
        description="KinderBee ONE is the early-years education ecosystem; KinderOS is the preschool operating system for admissions, attendance, fees and staff. Request a demo."
        keywords="KinderOS, KinderBee ONE, preschool management software, preschool ERP India, preschool curriculum platform"
        settings={settings}
        faq={FAQS}
      />

      {/* HERO */}
      <section className="bg-[#FFF8F7] border-b border-pink-100/70">
        <div className={`${wrap} py-10 sm:py-14 lg:py-16 grid lg:grid-cols-2 gap-10 items-center`}>
          <div className="kb-hero-in space-y-6">
            <span className={`inline-flex items-center gap-2 rounded-full bg-[#FFECF0] border border-pink-200/80 px-3.5 py-1.5 text-[#3E0021] ${label}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8006C]" /> The Kinderbee Digital Ecosystem
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-display font-extrabold tracking-tight text-[#252323] leading-[1.1]">
              One Ecosystem. <span className="text-[#B8006C]">Two Powerful Products.</span>{' '}
              <span className="rounded-lg bg-[#FFE34D] px-2 [box-decoration-break:clone]">A Better Future</span> for Early Education.
            </h1>
            <p className="text-[#615E5D] text-base sm:text-[17px] leading-relaxed max-w-xl">
              Discover a connected ecosystem that brings meaningful early-years education and intelligent preschool management together.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <a href="#kinderbee-one" className={`${cta} bg-[#B8006C] hover:bg-[#9c005a] text-white`}>Explore KinderBee ONE <ArrowRight className="h-4 w-4" /></a>
              <a href="#kinderos" className={`${cta} bg-[#204E3D] hover:bg-[#15372D] text-white`}>Discover KinderOS <ArrowRight className="h-4 w-4" /></a>
              <button onClick={demo} className={`${cta} border border-[#E7E1E1] bg-white hover:bg-stone-50 text-[#252323]`}>Talk to Our Team</button>
            </div>
          </div>

          <div className="rounded-3xl bg-[#FFE8D8] border border-[#E7E1E1] p-5 sm:p-7 space-y-4 shadow-sm">
            <div className="rounded-2xl bg-white border border-[#E7E1E1] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E7E1E1]">
                <span className="text-xs font-bold text-[#49382E]">KinderBee ONE · Curriculum Studio</span>
                <span className="rounded-full bg-[#FFE8D8] px-2 py-0.5 text-[10px] font-bold text-[#49382E]">Education Ecosystem</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[['Modules', '10 Domains'], ['Growth Matrix', 'KIPS'], ['Families', 'Connect']].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-[#FFF8EE] border border-[#E7E1E1] p-3">
                    <div className="text-[10px] font-bold text-[#49382E]">{k}</div>
                    <div className="mt-1 font-display font-extrabold text-[#252323] leading-tight">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-[#15372D] border border-[#204E3D] p-4 shadow-sm sm:ml-10 text-white">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#204E3D]">
                <span className="text-xs font-bold text-[#E5F0E8]">KinderOS · Operations Tablet</span>
                <span className="rounded-full bg-[#204E3D] px-2 py-0.5 text-[10px] font-bold text-[#E5F0E8]">Sample View</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[['Admissions', '24'], ['Attendance', '94%'], ['Fee Status', '91%']].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-[#204E3D] p-3">
                    <div className="text-[10px] font-bold text-[#E5F0E8]">{k}</div>
                    <div className="mt-1 font-display font-extrabold tabular-nums">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO PRODUCTS */}
      <section className="bg-[#FFF4E5] py-14 sm:py-20">
        <div className={`${wrap} space-y-10`}>
          <h2 className={H2}>Two Products. Two Powerful Possibilities.</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <article id="kinderbee-one" className="scroll-mt-28 rounded-2xl border border-[#E7E1E1] bg-white p-6 sm:p-8 flex flex-col gap-5">
              <span className="self-start rounded-full bg-[#FFE8D8] px-3 py-1 text-xs font-bold text-[#49382E]">Early-Years Education</span>
              <div>
                <h3 className="text-3xl font-display font-extrabold text-[#49382E]">KinderBee ONE</h3>
                <p className="mt-1 font-semibold text-[#252323]">The Complete Early Years Education Ecosystem.</p>
              </div>
              <p className="text-sm text-[#615E5D] leading-relaxed">Bringing curriculum, child development, educators, families and preschool partnerships together.</p>
              <div className="grid grid-cols-2 gap-2.5">
                {ONE_MODULES.map(m => <div key={m} className="rounded-lg bg-[#FFF8EE] border border-[#E7E1E1] p-3 text-xs font-bold text-[#49382E]">{m}</div>)}
              </div>
              <button onClick={demo} className={`${cta} self-start mt-auto bg-[#49382E] hover:bg-[#252323] text-white`}>Request ONE Demo <ArrowRight className="h-4 w-4" /></button>
            </article>

            <article id="kinderos" className="scroll-mt-28 rounded-2xl border border-[#E7E1E1] bg-[#E5F0E8] p-6 sm:p-8 flex flex-col gap-5">
              <span className="self-start rounded-full bg-white px-3 py-1 text-xs font-bold text-[#204E3D]">Preschool Operations SaaS</span>
              <div>
                <h3 className="text-3xl font-display font-extrabold text-[#15372D]">KinderOS</h3>
                <p className="mt-1 font-semibold text-[#252323]">The Smart Operating System for Preschools.</p>
              </div>
              <p className="text-sm text-[#615E5D] leading-relaxed">Manage admissions, students, attendance, fees, staff and school administration through one digital platform.</p>
              <div className="grid grid-cols-2 gap-2.5">
                {OS_MODULES.map(m => <div key={m} className="rounded-lg bg-white border border-[#E7E1E1] p-3 text-xs font-bold text-[#15372D]">{m}</div>)}
              </div>
              <button onClick={demo} className={`${cta} self-start mt-auto bg-[#204E3D] hover:bg-[#15372D] text-white`}>Book KinderOS Demo <ArrowRight className="h-4 w-4" /></button>
            </article>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATION */}
      <section className="bg-[#FFF8F7] py-14 sm:py-20">
        <div className={`${wrap} space-y-10`}>
          <h2 className={`${H2} max-w-2xl`}>Designed for Two Essential Dimensions of Early Education.</h2>
          <div className="grid md:grid-cols-2 overflow-hidden rounded-2xl border border-[#E7E1E1] bg-white md:divide-x divide-y md:divide-y-0 divide-[#E7E1E1]">
            {[
              { k: 'Pedagogy & Community', t: 'KinderBee ONE', c: 'text-[#49382E]', l: ['Educational ecosystem', 'Curriculum & lesson delivery', 'Child development tracking', 'Learning experiences', 'Educator enablement', 'Family engagement'] },
              { k: 'Administration & Growth', t: 'KinderOS', c: 'text-[#204E3D]', l: ['School operations', 'Admissions pipeline', 'Student records', 'Daily attendance', 'Fees & billing', 'Administration & reports'] },
            ].map(c => (
              <div key={c.t} className="p-6 sm:p-8 space-y-3">
                <span className={`${label} ${c.c}`}>{c.k}</span>
                <h3 className={`text-2xl font-display font-extrabold ${c.c}`}>{c.t}</h3>
                <ul className="space-y-2 text-sm text-[#252323]">{c.l.map(x => <li key={x}>• {x}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KINDERBEE ONE SHOWCASE */}
      <section className="bg-[#FFF4E5] py-14 sm:py-20 border-t border-[#E7E1E1]">
        <div className={`${wrap} space-y-10`}>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-2">
              <span className={`${label} text-[#49382E]`}>KinderBee ONE</span>
              <h2 className={H2}>Where Every Learning Journey Comes Together.</h2>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E7E1E1] bg-white p-5">
              <div>
                <p className="font-bold text-[#49382E]">Layered Curriculum Workspace</p>
                <p className="mt-1 text-sm text-[#615E5D]">Daily activities, KIPS observations, and educator guides organized in one calm space.</p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FFE8D8]"><Layers className="h-6 w-6 text-[#49382E]" /></span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ONE_FEATURES.map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-[#E7E1E1] bg-white p-6 space-y-2 transition hover:-translate-y-1 hover:shadow-lg">
                <Icon className="h-6 w-6 text-[#B8006C]" />
                <h3 className="text-lg font-display font-bold text-[#252323]">{t}</h3>
                <p className="text-sm text-[#615E5D] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PROGRAMMES.map(p => (
              <div key={p.t} className={`${p.bg} rounded-xl border border-black/5 p-5 text-center font-display font-extrabold uppercase tracking-wide text-[#252323]`}>{p.t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* KINDEROS DASHBOARD */}
      <section className="bg-[#15372D] text-white py-14 sm:py-20">
        <div className={`${wrap} space-y-10`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight leading-tight">Run Your Preschool. Not Your Paperwork.</h2>
              <p className="mt-2 text-[#E5F0E8]">One organized digital environment for everyday preschool operations.</p>
            </div>
            <span className="self-start rounded-full bg-[#204E3D] px-3 py-1.5 text-xs font-bold text-[#E5F0E8]">Illustrative Sample Data</span>
          </div>

          <div className="grid lg:grid-cols-12 overflow-hidden rounded-2xl border border-[#204E3D] bg-white text-[#252323] shadow-xl">
            <aside className="lg:col-span-3 flex lg:flex-col gap-1 overflow-x-auto bg-[#F5F7F6] p-4 border-b lg:border-b-0 lg:border-r border-[#E7E1E1]">
              {OS_SIDEBAR.map((s, i) => (
                <span key={s} className={`shrink-0 rounded-md px-3 py-2 text-xs font-bold ${i === 0 ? 'bg-[#204E3D] text-white' : ''}`}>{s}</span>
              ))}
            </aside>
            <div className="lg:col-span-9 p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[['Total Students', '142'], ['New Admissions', '18'], ["Today's Attendance", '95.1%'], ['Fee Collection', '93%']].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-[#E7E1E1] bg-[#F5F7F6] p-4">
                    <div className="text-xs font-semibold text-[#615E5D]">{k}</div>
                    <div className="mt-1 text-2xl font-display font-extrabold text-[#15372D] tabular-nums">{v}</div>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#E7E1E1] p-4">
                  <h3 className="mb-3 font-bold text-[#15372D]">Admissions Pipeline (Sample)</h3>
                  {[['Enquiries', 38, 'w-4/5'], ['Campus Tours', 22, 'w-3/5'], ['Enrolled', 18, 'w-2/5']].map(([k, n, w]) => (
                    <div key={k as string} className="mb-2">
                      <div className="flex justify-between text-sm"><span>{k}</span><span className="font-mono tabular-nums">{n}</span></div>
                      <div className="mt-1 h-2 rounded-full bg-[#E5F0E8]"><div className={`h-full rounded-full bg-[#204E3D] ${w}`} /></div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-[#E7E1E1] p-4">
                  <h3 className="mb-3 font-bold text-[#15372D]">Recent Activities (Sample)</h3>
                  <ul className="space-y-2.5 text-sm text-[#615E5D]">
                    <li>• Morning attendance synced for Smarties &amp; Questers</li>
                    <li>• Term 1 fee receipt issued for 6 families</li>
                    <li>• Route 2 bus check-in confirmed at 08:40 AM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="bg-white py-14 sm:py-20">
        <div className={`${wrap} space-y-10`}>
          <h2 className={`${H2} max-w-2xl`}>Technology That Supports Every Part of the Preschool Journey.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {AUDIENCES.map(({ icon: Icon, t }) => (
              <div key={t} className="rounded-2xl border border-[#E7E1E1] bg-[#FFF8F7] p-6 flex flex-col items-center gap-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFECF0]"><Icon className="h-6 w-6 text-[#B8006C]" /></span>
                <span className="font-bold text-[#252323]">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="bg-[#FFF8F7] border-y border-[#E7E1E1] py-14 sm:py-20">
        <div className={`${wrap} space-y-10`}>
          <h2 className={`${H2} text-center`}>One Vision. Two Connected Product Experiences.</h2>
          <div className="grid lg:grid-cols-3 gap-5 items-center">
            <div className="rounded-xl border border-[#E7E1E1] bg-[#FFF8EE] p-6 space-y-3">
              <h3 className="text-lg font-display font-bold text-[#49382E]">KinderBee ONE</h3>
              <div className="flex flex-wrap gap-2">
                {['Curriculum', 'Development', 'Educators', 'Families', 'Partnerships'].map(x => <span key={x} className="rounded-full border border-[#E7E1E1] bg-white px-3 py-1 text-xs font-bold text-[#49382E]">{x}</span>)}
              </div>
            </div>
            <div className="rounded-2xl border-2 border-[#B8006C] bg-white p-6 text-center space-y-1">
              <Network className="mx-auto h-8 w-8 text-[#B8006C]" />
              <h3 className="font-display font-extrabold text-[#252323]">Kinderbee Digital Ecosystem</h3>
              <p className="text-sm text-[#615E5D]">Complementary education &amp; operations platforms</p>
            </div>
            <div className="rounded-xl border border-[#E7E1E1] bg-[#E5F0E8] p-6 space-y-3">
              <h3 className="text-lg font-display font-bold text-[#15372D]">KinderOS</h3>
              <div className="flex flex-wrap gap-2">
                {['Admissions', 'Students', 'Attendance', 'Fees', 'Staff', 'Operations'].map(x => <span key={x} className="rounded-full border border-[#E7E1E1] bg-white px-3 py-1 text-xs font-bold text-[#15372D]">{x}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO CTA */}
      <section className="bg-white py-14 sm:py-16">
        <div className={`${wrap} grid md:grid-cols-2 gap-6`}>
          <div className="rounded-2xl border border-[#E7E1E1] bg-[#FFF8EE] p-8 flex flex-col justify-between gap-5">
            <div>
              <h3 className="text-2xl font-display font-extrabold text-[#49382E]">KinderBee ONE</h3>
              <p className="mt-2 text-lg text-[#252323]">Experience a better approach to early-years education.</p>
            </div>
            <button onClick={demo} className={`${cta} self-start bg-[#49382E] text-white hover:bg-[#252323]`}>Request ONE Demo</button>
          </div>
          <div className="rounded-2xl border border-[#E7E1E1] bg-[#E5F0E8] p-8 flex flex-col justify-between gap-5">
            <div>
              <h3 className="text-2xl font-display font-extrabold text-[#15372D]">KinderOS</h3>
              <p className="mt-2 text-lg text-[#252323]">Discover a smarter way to manage your preschool.</p>
            </div>
            <button onClick={demo} className={`${cta} self-start bg-[#204E3D] text-white hover:bg-[#15372D]`}>Book KinderOS Demo</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FFF8F7] border-t border-[#E7E1E1] py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-6">
          <h2 className={H2}>Questions About Our Products?</h2>
          <div className="divide-y divide-[#E7E1E1] rounded-xl border border-[#E7E1E1] bg-white px-5">
            {FAQS.map((f, i) => (
              <details key={f.q} name="products-faq" className="group py-4" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#252323] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#615E5D] transition-transform group-open:rotate-180" />
                </summary>
                <p className="pt-3 text-sm text-[#615E5D] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
