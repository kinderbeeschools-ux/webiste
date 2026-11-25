import React from 'react';
import { useStagger } from './Motion';

// Bento photo grid for the home page. Uses the existing .kb-frame / .kb-caption hover effects and .stagger entrance.
const TILES = [
  { src: '/visuals/nordic-classroom.webp', w: 1000, h: 754, title: 'Finnish-inspired classrooms', alt: 'Bright Finnish-inspired play-based preschool classroom at a Kinderbee school', cls: 'sm:col-span-2 sm:row-span-2' },
  { src: '/visuals/discovery-lab.webp', w: 800, h: 1027, title: 'Discovery lab', alt: 'Children exploring hands-on learning in a Kinderbee preschool discovery lab', cls: 'sm:row-span-2' },
  { src: '/visuals/art-studio.webp', w: 1000, h: 532, title: 'Art studio', alt: 'Creative art studio for preschool children in a Kinderbee franchise school', cls: '' },
  { src: '/visuals/reading-nook.webp', w: 800, h: 1057, title: 'Reading nook', alt: 'Cosy reading nook for early literacy in a Kinderbee preschool', cls: 'sm:row-span-2' },
  { src: '/visuals/teacher-ecce.webp', w: 820, h: 536, title: 'Trained teachers', alt: 'Kinderbee teacher trained in early childhood care and education guiding preschoolers', cls: 'sm:col-span-2' },
  { src: '/visuals/kips-campus.webp', w: 1400, h: 933, title: 'Franchise campus', alt: 'Kinderbee preschool franchise campus designed under the KIPS partnership system', cls: 'sm:col-span-2' },
];

export const KinderbeeGallery: React.FC = () => {
  const [ref, cls] = useStagger(0.1);
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12" aria-labelledby="kb-gallery-h">
      <span aria-hidden="true" className="kb-drift pointer-events-none absolute -top-8 -left-6 h-28 w-28 rounded-full bg-[#FFD400]/30 blur-2xl" />
      <span aria-hidden="true" className="kb-drift pointer-events-none absolute -bottom-10 -right-4 h-36 w-36 rounded-full bg-[#E1007A]/15 blur-3xl" style={{ animationDelay: '3s' }} />
      <div className="relative text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-[#E1007A]">Inside a Kinderbee preschool</p>
        <h2 id="kb-gallery-h" className="mt-2 text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#1C1917]">
          Spaces where children <span className="kb-shimmer-pink">love to learn</span>
        </h2>
        <p className="mt-3 text-stone-600">Play-based classrooms, labs and reading corners that every Kinderbee franchise partner can bring to their city.</p>
      </div>
      <div ref={ref} className={`relative mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 sm:auto-rows-[170px] ${cls}`}>
        {TILES.map((t) => (
          <figure key={t.src} className={`group kb-frame rounded-3xl border-4 border-white shadow-lg shadow-pink-900/10 bg-stone-100 aspect-[4/3] sm:aspect-auto ${t.cls}`}>
            <img src={t.src} alt={t.alt} width={t.w} height={t.h} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <figcaption className="kb-caption absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
              <div className="text-sm font-bold text-white">{t.title}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
