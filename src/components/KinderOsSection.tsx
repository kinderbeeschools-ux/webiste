import React from 'react';
import {
  Sparkles, LayoutDashboard, Users, UserPlus, CalendarCheck, Wallet, Briefcase, BookOpen,
  Bell, BarChart3, Settings, Brain, Puzzle, ArrowRight, CheckCircle2, Smartphone,
} from 'lucide-react';

// From the Kinderbee Franchise & CRM booklet
const MODULES = [
  { icon: LayoutDashboard, t: 'Dashboard & Overview', d: 'Admissions, fees, income & insights' },
  { icon: Users, t: 'Student Management', d: 'Profiles, classes, records, progress' },
  { icon: UserPlus, t: 'Admission Management', d: 'Enquiries, leads and follow-ups' },
  { icon: CalendarCheck, t: 'Attendance', d: 'Students, staff, monthly reports' },
  { icon: Wallet, t: 'Fee & Accounts', d: 'Fees, payments, income, expenses' },
  { icon: Briefcase, t: 'Staff Management', d: 'Profiles, attendance, role access' },
  { icon: BookOpen, t: 'Academic Management', d: 'Lessons, timetables, progress' },
  { icon: Bell, t: 'Parent Communication', d: 'Announcements & notifications' },
  { icon: BarChart3, t: 'Reports & Analytics', d: 'Student, fee & operations reports' },
  { icon: Settings, t: 'Administration', d: 'Users, permissions, school settings' },
];

const MANTRAS = [
  { icon: Puzzle, n: '1', t: 'Curriculum & toolkit', d: '10 multi-intelligence modules, detailed daily lesson plans and turnkey toolkits. NEP 2020 & NCF-FS aligned, with AI-assisted lesson planning built in.' },
  { icon: Smartphone, n: '2', t: 'KinderOS, your digital CRM', d: 'Your whole school on your phone. Admissions, fees, attendance, staff and parents in one platform, free with the franchise.' },
  { icon: Brain, n: '3', t: 'Cognitive Developmental Matrix', d: 'A structured assessment for 5–6 year-olds across 6 development areas, rated 1–5, with teacher notes you can share with parents.' },
];

const WAYS = [
  { h: 'Starting fresh? Own a preschool', items: ['Setup guidance', 'Brand identity', 'Curriculum & toolkit', 'Teacher training'] },
  { h: 'Already running one? Rebrand it', items: ['New Kinderbee identity', 'Curriculum integration', 'Free KinderOS CRM', 'Ongoing support'] },
];

export const KinderOsSection: React.FC<{ onOpenConsultation: () => void }> = ({ onOpenConsultation }) => (
  <section id="kinderos" aria-labelledby="kinderos-title" className="max-w-7xl mx-auto px-4 sm:px-8">
    <div className="text-center max-w-3xl mx-auto space-y-4">
      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full">
        <Sparkles className="w-3.5 h-3.5" /> AI-powered preschool franchise
      </div>
      <h2 id="kinderos-title" className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-[#1C1917] [text-wrap:balance]">
        Meet <span className="text-[#E1007A]">KinderOS</span>, the Kinder Operating System
      </h2>
      <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
        Every Kinderbee franchise runs on AI-assisted lesson planning and KinderOS, a free preschool CRM, so you can manage your school from home.
      </p>
    </div>

    {/* The three mantras */}
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {MANTRAS.map(({ icon: Icon, n, t, d }) => (
        <div key={n} className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E1007A] text-white"><Icon className="h-5 w-5" /></span>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">KIPS mantra {n}</span>
          </div>
          <h3 className="mt-4 text-lg font-extrabold text-stone-900">{t}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{d}</p>
        </div>
      ))}
    </div>

    {/* KinderOS modules */}
    <div className="mt-8 rounded-3xl bg-stone-900 p-6 sm:p-10 text-white">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="text-2xl sm:text-3xl font-display font-extrabold">What you manage in KinderOS, free</h3>
        <p className="text-sm text-stone-300">Included with every franchise, new or rebranded.</p>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {MODULES.map(({ icon: Icon, t, d }) => (
          <li key={t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <Icon className="h-5 w-5 text-[#FFD400]" aria-hidden="true" />
            <div className="mt-2 text-sm font-bold">{t}</div>
            <div className="mt-0.5 text-xs text-stone-300">{d}</div>
          </li>
        ))}
      </ul>
    </div>

    {/* Two ways in */}
    <div className="mt-8 grid gap-5 md:grid-cols-2">
      {WAYS.map(({ h, items }) => (
        <div key={h} className="rounded-3xl border border-stone-200 bg-white p-6">
          <h3 className="text-lg font-extrabold text-stone-900">{h}</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-stone-700">
            {items.map(i => <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#E1007A]" />{i}</li>)}
          </ul>
        </div>
      ))}
    </div>

    <div className="mt-8 text-center">
      <button onClick={onOpenConsultation} className="inline-flex items-center gap-2 rounded-full bg-[#E1007A] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#c90070] cursor-pointer">
        See KinderOS in a free consultation <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </section>
);
