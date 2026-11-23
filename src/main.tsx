import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { captureAttribution } from './utils/attribution';

captureAttribution();
// index.html ships a description for crawlers; SEOHead sets the per-page one from here on
document.getElementById('static-description')?.remove();

const root = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// The home page ships fully rendered HTML: attach to it instead of rebuilding it, so it paints before the
// JavaScript has run. Other pages still render in the browser (their journal and FAQ data loads after the HTML was built).
if (root.dataset.ssrPath === '/' && window.location.pathname === '/' && !window.location.search && root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  // Not attaching to the prerendered HTML: drop its head tags first, React writes the page's own (no duplicates)
  const start = [...document.head.childNodes].find(n => n.nodeType === 8 && n.nodeValue === 'ssr-head');
  if (start) {
    for (let n: ChildNode | null = start; n; ) {
      const next: ChildNode | null = n.nextSibling;
      const isEnd = n.nodeType === 8 && n.nodeValue === '/ssr-head';
      n.remove();
      if (isEnd) break;
      n = next;
    }
  }
  createRoot(root).render(app);
}

