import React, { useRef } from 'react';
import { useInView } from 'motion/react';

// Smooth "expo-out" curve shared by all page entrance animations
export const EASE = [0.22, 1, 0.36, 1] as const;

// Section wrapper. The reveal itself is site-wide (AutoReveal.ts): headings, text, images and cards
// inside rise in one by one instead of the whole section fading as a block.
export const Reveal: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;

// For grids whose children should rise in one after another (.stagger in index.css).
// Usage: const [ref, cls] = useStagger(); <div ref={ref} className={`grid ... ${cls}`}>
export function useStagger(amount = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return [ref, inView ? 'stagger is-in' : 'stagger'] as const;
}
