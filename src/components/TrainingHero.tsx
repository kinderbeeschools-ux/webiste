import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Lightbulb, BookOpen, Users, Award, GraduationCap } from 'lucide-react';
import { EASE } from './Motion';
import { Bee, Rainbow, Star, Blocks, Squiggle } from './Doodles';

// Highlights are taken from the course posters
const HIGHLIGHTS = [
  { icon: Lightbulb, label: 'Expert Faculty' },
  { icon: BookOpen, label: 'Practical Learning' },
  { icon: Users, label: 'Hands-on Experience' },
  { icon: Award, label: 'Career Opportunities' },
];

const COURSE_CARDS = [
  { title: 'Advanced Diploma in Early Childhood Care & Education', tag: 'Advanced Credential', band: 'from-[#E1007A] to-pink-500', rotate: -11, left: '3%', top: '30%' },
  { title: 'Diploma in Play school Teacher Training', tag: 'Professional Diploma', band: 'from-[#FFD400] to-amber-400', rotate: -4, left: '21%', top: '20%' },
  { title: 'Certificate in Nordic inspired Preschool Teaching', tag: 'Specialized Certificate', band: 'from-sky-400 to-sky-300', rotate: 4, left: '39%', top: '24%' },
  { title: 'Foundational Stage Curriculum Design', tag: 'Curriculum Mastery', band: 'from-emerald-400 to-emerald-300', rotate: 11, left: '57%', top: '33%' },
];

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const TrainingHero: React.FC<{ onExplore: () => void; onEnquire: () => void }> = ({ onExplore, onEnquire }) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-[#FAF9F6] to-yellow-50 px-4 sm:px-8 pt-10 sm:pt-16 pb-14 sm:pb-20">
    {/* Background texture */}
    <div aria-hidden="true" className="absolute inset-0 opacity-40 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
    <Star className="hidden sm:block absolute top-10 left-[6%] w-8 kb-spin-slow" />
    <Star color="#E1007A" className="hidden sm:block absolute bottom-16 left-[45%] w-5 kb-wiggle" />

    <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
      {/* Copy */}
      <motion.div
        className="space-y-6 text-center lg:text-left"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        <motion.div variants={item} className="inline-flex items-center gap-2 bg-white border border-pink-200 text-[#E1007A] text-[11px] sm:text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD400] kb-wiggle" />
          <span>Teacher Training &amp; Pedagogy Certifications</span>
        </motion.div>

        <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-[#1C1917] leading-[1.08]">
          Early Childhood &amp;{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1007A] via-pink-500 to-[#70162A]">Teacher Training Programs</span>
            <Squiggle className="absolute -bottom-3 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-40 h-5" />
          </span>
        </motion.h1>

        <motion.p variants={item} className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
          Empowering future preschool educators with world-class curriculum frameworks and recognized credentials.
        </motion.p>

        <motion.ul variants={item} className="grid grid-cols-2 gap-2.5 max-w-md mx-auto lg:mx-0">
          {HIGHLIGHTS.map(h => (
            <li key={h.label} className="group flex items-center gap-2.5 bg-white/80 border border-stone-200 rounded-xl px-3 py-2.5 text-left transition-[translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-pink-200">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-pink-50 text-[#E1007A] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <h.icon className="w-4 h-4" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-stone-700">{h.label}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
          <button
            onClick={onExplore}
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E1007A] to-pink-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            Explore Programs
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={onEnquire}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-bold px-7 py-3.5 rounded-xl border border-stone-300 transition cursor-pointer"
          >
            Enquire Now
          </button>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-stone-500">
          <span><strong className="text-[#E1007A] text-base">4</strong> Programmes</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Admissions open 2026–27</span>
          <span>A KIPS initiative by Kinderbee</span>
        </motion.div>
      </motion.div>

      {/* Illustration */}
      <div className="relative mx-auto w-full max-w-[520px] aspect-[1/0.9]">
        {/* Morphing brand blob */}
        <motion.div
          aria-hidden="true"
          className="kb-morph absolute inset-[6%] bg-gradient-to-br from-[#E1007A] via-pink-400 to-[#FFD400] shadow-2xl shadow-pink-500/30"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: EASE }}
        />
        <div aria-hidden="true" className="kb-morph absolute inset-[14%] bg-white/15 [animation-delay:-4s]" />

        {/* Fanned course cards */}
        {COURSE_CARDS.map((c, i) => (
          <motion.div
            key={c.title}
            className="absolute w-[40%]"
            style={{ left: c.left, top: c.top, zIndex: i + 1 }}
            initial={{ opacity: 0, y: 80, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: c.rotate }}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.5 + i * 0.15 }}
          >
            <div className="kb-float rounded-2xl bg-white shadow-xl border border-stone-100 overflow-hidden transition-transform duration-300 hover:-translate-y-3 hover:scale-105" style={{ animationDelay: `${i * -1.5}s` }}>
              <div className={`h-10 sm:h-12 bg-gradient-to-r ${c.band} relative`}>
                <GraduationCap className="absolute right-2 bottom-1.5 w-5 h-5 text-white/90" />
              </div>
              <div className="p-2.5 sm:p-3 space-y-1.5">
                <div className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#E1007A]">{c.tag}</div>
                <div className="text-[10px] sm:text-xs font-bold text-stone-800 leading-snug line-clamp-3">{c.title}</div>
                <div className="flex gap-1 pt-1">
                  <span className="h-1.5 w-8 rounded-full bg-stone-200" />
                  <span className="h-1.5 w-5 rounded-full bg-stone-100" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Floating certificate badge */}
        <motion.div
          className="absolute right-0 sm:-right-2 bottom-[8%] z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 1.3 }}
        >
          <div className="kb-float flex items-center gap-2.5 bg-white rounded-2xl shadow-xl border border-stone-100 px-3 py-2.5 [animation-delay:-2s]">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD400] to-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5 text-stone-900" />
            </span>
            <span className="text-left">
              <span className="block text-[11px] font-extrabold text-stone-800">FinnishWay Academy</span>
              <span className="block text-[10px] text-stone-500">Inspired by Finnish excellence</span>
            </span>
          </div>
        </motion.div>

        {/* Doodles */}
        <Bee className="absolute -top-2 left-0 w-20 sm:w-28 z-10 kb-fly" />
        <Rainbow className="absolute top-0 right-[4%] w-20 sm:w-24 kb-float [animation-delay:-3s]" />
        <Blocks className="absolute bottom-[4%] left-[2%] w-20 sm:w-28 z-10 kb-wiggle" />
      </div>
    </div>
  </section>
);
