import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

// Smooth "expo-out" curve shared by all page entrance animations
export const EASE = [0.22, 1, 0.36, 1] as const;

// Fades and lifts a section in the first time it scrolls into view
export const Reveal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 48 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.9, ease: EASE }}
  >
    {children}
  </motion.div>
);

// For grids whose children should rise in one after another (.stagger in index.css).
// Usage: const [ref, cls] = useStagger(); <div ref={ref} className={`grid ... ${cls}`}>
export function useStagger(amount = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return [ref, inView ? 'stagger is-in' : 'stagger'] as const;
}
