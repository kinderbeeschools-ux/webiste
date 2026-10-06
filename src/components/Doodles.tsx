import React from 'react';

// Hand-drawn style decorative illustrations in Kinderbee colours.
// Purely decorative: aria-hidden, no pointer events. Size/position them with className.
type DoodleProps = { className?: string };

const PINK = '#E1007A';
const YELLOW = '#FFD400';
const INK = '#1C1917';

const svgProps = (className = '') => ({
  className: `pointer-events-none select-none ${className}`,
  'aria-hidden': true as const,
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
});

export const Bee: React.FC<DoodleProps> = ({ className }) => (
  <svg viewBox="0 0 120 90" {...svgProps(className)}>
    {/* dashed flight trail */}
    <path d="M4 70 C 20 40, 40 85, 58 55" stroke={INK} strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" opacity="0.45" />
    {/* wings */}
    <ellipse cx="80" cy="30" rx="13" ry="17" transform="rotate(-25 80 30)" fill="#fff" stroke={INK} strokeWidth="2.5" />
    <ellipse cx="96" cy="30" rx="11" ry="15" transform="rotate(25 96 30)" fill="#fff" stroke={INK} strokeWidth="2.5" />
    {/* body */}
    <ellipse cx="86" cy="54" rx="22" ry="16" fill={YELLOW} stroke={INK} strokeWidth="2.5" />
    <path d="M80 39 C 76 48, 76 60, 80 69" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <path d="M92 39 C 96 48, 96 60, 92 69" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    {/* face */}
    <circle cx="104" cy="50" r="2.4" fill={INK} />
    <path d="M100 58 q 4 3 7 -1" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    <circle cx="106" cy="56" r="2.5" fill={PINK} opacity="0.5" />
    {/* stinger + antenna */}
    <path d="M64 54 l -6 1 l 6 3" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M100 41 q 4 -12 12 -12" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    <circle cx="112" cy="29" r="2.5" fill={PINK} />
  </svg>
);

export const Rainbow: React.FC<DoodleProps> = ({ className }) => (
  <svg viewBox="0 0 120 70" {...svgProps(className)}>
    <path d="M10 64 a 50 50 0 0 1 100 0" stroke={PINK} strokeWidth="9" strokeLinecap="round" />
    <path d="M24 64 a 36 36 0 0 1 72 0" stroke={YELLOW} strokeWidth="9" strokeLinecap="round" />
    <path d="M38 64 a 22 22 0 0 1 44 0" stroke="#F9A8D4" strokeWidth="9" strokeLinecap="round" />
    <circle cx="12" cy="64" r="8" fill="#fff" stroke={INK} strokeWidth="2" />
    <circle cx="108" cy="64" r="8" fill="#fff" stroke={INK} strokeWidth="2" />
  </svg>
);

export const Star: React.FC<DoodleProps & { color?: string }> = ({ className, color = YELLOW }) => (
  <svg viewBox="0 0 40 40" {...svgProps(className)}>
    <path d="M20 3 C 22 15, 25 18, 37 20 C 25 22, 22 25, 20 37 C 18 25, 15 22, 3 20 C 15 18, 18 15, 20 3 Z" fill={color} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const Squiggle: React.FC<DoodleProps & { color?: string }> = ({ className, color = PINK }) => (
  <svg viewBox="0 0 120 24" {...svgProps(className)}>
    <path d="M3 12 q 10 -12 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" stroke={color} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const Cloud: React.FC<DoodleProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" {...svgProps(className)}>
    <path d="M22 50 h 56 a 16 16 0 0 0 0 -32 a 22 22 0 0 0 -40 -4 a 15 15 0 0 0 -16 36 z" fill="#fff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="44" cy="34" r="2" fill={INK} />
    <circle cx="58" cy="34" r="2" fill={INK} />
    <path d="M47 41 q 4 4 8 0" stroke={INK} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Heart: React.FC<DoodleProps> = ({ className }) => (
  <svg viewBox="0 0 40 36" {...svgProps(className)}>
    <path d="M20 33 C 6 23, 2 15, 6 8 C 10 2, 18 3, 20 10 C 22 3, 30 2, 34 8 C 38 15, 34 23, 20 33 Z" fill={PINK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M10 11 q 2 -3 5 -3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Blocks: React.FC<DoodleProps> = ({ className }) => (
  <svg viewBox="0 0 120 90" {...svgProps(className)}>
    {[
      { x: 4, y: 46, f: PINK, l: 'A' },
      { x: 44, y: 46, f: YELLOW, l: 'B' },
      { x: 24, y: 6, f: '#7DD3FC', l: 'C' },
    ].map(b => (
      <g key={b.l}>
        <rect x={b.x} y={b.y} width="38" height="38" rx="6" fill={b.f} stroke={INK} strokeWidth="2.5" />
        <text x={b.x + 19} y={b.y + 27} textAnchor="middle" fontSize="22" fontWeight="900" fill={b.l === 'B' ? INK : '#fff'} stroke={INK} strokeWidth="0.8">{b.l}</text>
      </g>
    ))}
    <path d="M88 80 l 8 -22 l 8 22 z" fill="#86EFAC" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

export const Dots: React.FC<DoodleProps & { color?: string }> = ({ className, color = PINK }) => (
  <svg viewBox="0 0 60 60" {...svgProps(className)}>
    {[0, 1, 2, 3].flatMap(r => [0, 1, 2, 3].map(c => <circle key={`${r}-${c}`} cx={8 + c * 15} cy={8 + r * 15} r="2.6" fill={color} />))}
  </svg>
);
