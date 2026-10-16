import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { SystemSettings } from '../types';
import { pathFor } from '../utils/routes';

interface NotFoundPageProps {
  setCurrentTab: (tab: string) => void;
  settings?: SystemSettings | null;
}

const LINKS = [
  ['home', 'Home'],
  ['franchise', 'Preschool Franchise'],
  ['partnerships-cbse', 'CBSE School Setup'],
  ['partnerships-degree', 'Degree College Setup'],
  ['fwa', 'Teacher Training'],
  ['blogs', 'Blog'],
  ['contact', 'Contact Us'],
];

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ setCurrentTab, settings }) => (
  <div className="bg-[#FAF9F6] min-h-[70vh] flex items-center py-16">
    <SEOHead title="Page Not Found" description="The page you are looking for does not exist or has moved." settings={settings} noIndex />
    <div className="max-w-2xl mx-auto px-4 text-center">
      <p className="text-7xl sm:text-8xl font-display font-extrabold text-[#E1007A]">404</p>
      <h1 className="mt-4 text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">Oops! This page flew away</h1>
      <p className="mt-4 text-stone-600">The page you are looking for doesn't exist or has moved. Try one of these instead:</p>
      <nav className="mt-8 flex flex-wrap justify-center gap-3">
        {LINKS.map(([tab, label]) => (
          <a
            key={tab}
            href={pathFor(tab)}
            onClick={e => { e.preventDefault(); setCurrentTab(tab); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${tab === 'home' ? 'bg-[#E1007A] text-white hover:bg-[#c0006a]' : 'bg-white border border-stone-200 text-stone-700 hover:text-[#E1007A] hover:border-[#E1007A]'}`}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  </div>
);
