import { useEffect } from 'react';

// Site-wide scroll reveal: headings, text, images and cards inside <main> rise in as they enter the
// viewport, in a short stagger. Pure CSS classes (.kb-r / .kb-in in index.css), so:
// - content is only hidden once this script has marked it (nothing hides if JS or the observer fails)
// - visitors with "reduce motion" get no reveal at all
// - elements that animate themselves (Motion components, .stagger grids, marquees) are left alone

const TARGETS = [
  'h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'blockquote', 'table', 'form', 'img', 'video', 'iframe',
  '.grid > *', '[class*="rounded-2xl"]', '[class*="rounded-3xl"]', '[class*="rounded-[2"]', 'a[class*="rounded"]', 'button',
].join(',');

// Things that already have their own motion or must never be hidden
const SKIP = '.stagger, [class*="overflow-x-auto"], .animate-marquee-left, [data-no-reveal], [role="dialog"], [aria-hidden="true"], .kb-ticket, .fixed, .sticky';

const animatedByScript = (el: Element, root: Element) => {
  for (let n: Element | null = el; n && n !== root; n = n.parentElement) {
    const s = (n as HTMLElement).style;
    if (s && (s.opacity || s.transform || s.clipPath)) return true;
  }
  return false;
};

export function useAutoReveal(key: unknown, enabled = true) {
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.querySelector('main');
    if (!root) return;

    const io = new IntersectionObserver(entries => {
      // Elements arriving together get a small stagger, in document order
      const arriving = entries.filter(e => e.isIntersecting).map(e => e.target as HTMLElement);
      arriving.forEach((el, i) => {
        el.style.setProperty('--kb-d', `${Math.min(i, 8) * 70}ms`);
        el.classList.add('kb-in');
        io.unobserve(el);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -6% 0px' });

    const scan = () => {
      const picked: Element[] = [];
      root.querySelectorAll(TARGETS).forEach(el => {
        if (el.closest('.kb-r') || el.closest(SKIP) || animatedByScript(el, root)) return;
        // Keep the outermost target: a card animates as one piece, not word by word
        if (picked.some(p => p.contains(el))) return;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        // Big wrappers would fade as one block: reveal their contents instead
        if (r.height > window.innerHeight * 0.9) return;
        // Elements with their own CSS animation (floating doodles, Ken Burns…) keep it
        if (getComputedStyle(el).animationName !== 'none') return;
        picked.push(el);
      });
      picked.forEach(el => {
        el.classList.add('kb-r');
        io.observe(el);
      });
    };

    // Pages render in steps (data loads, images); scan a few times shortly after showing a page
    const timers = [0, 400, 1200].map(ms => window.setTimeout(scan, ms));
    return () => {
      timers.forEach(clearTimeout);
      io.disconnect();
      // Anything still waiting must not stay hidden
      root.querySelectorAll('.kb-r:not(.kb-in)').forEach(el => el.classList.add('kb-in'));
    };
  }, [key, enabled]);
}
