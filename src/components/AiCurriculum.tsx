import React from 'react';
import { Sparkles } from 'lucide-react';

// AI-Assisted Curriculum module, part of every teacher-training programme (Home + Teacher Training page)
export const AI_CURRICULUM_TOPICS = [
  'AI-assisted lesson planning',
  'Age-appropriate activity & worksheet creation',
  'AI-supported educational content development',
  'Digital teaching resources for preschool educators',
  'Responsible, age-appropriate use of AI in early childhood education',
];

export const AiCurriculum: React.FC<{ tone?: 'dark' | 'light'; className?: string }> = ({ tone = 'light', className = '' }) => {
  const dark = tone === 'dark';
  return (
    <div className={`rounded-2xl border p-5 sm:p-6 flex flex-col lg:flex-row gap-4 lg:items-center ${dark ? 'border-[#FFD400]/30 bg-white/[0.06]' : 'border-pink-100 bg-gradient-to-r from-pink-50 to-amber-50'} ${className}`}>
      <div className="flex items-center gap-3 lg:w-72 shrink-0">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${dark ? 'bg-[#FFD400] text-stone-900' : 'bg-[#E1007A] text-white'}`}>
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className={`text-[10px] font-extrabold uppercase tracking-widest ${dark ? 'text-[#FFD400]' : 'text-[#E1007A]'}`}>Included in every programme</p>
          <h3 className={`font-display text-lg font-bold leading-tight ${dark ? 'text-white' : 'text-stone-900'}`}>AI-Assisted Curriculum</h3>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="AI-Assisted Curriculum topics">
        {AI_CURRICULUM_TOPICS.map(t => (
          <li key={t} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${dark ? 'border-white/15 bg-white/[0.06] text-stone-100' : 'border-pink-200/70 bg-white text-stone-700'}`}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
};
