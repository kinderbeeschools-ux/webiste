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
// JavaScript has run. Other pages still render on the client (their journal and FAQ data loads after the HTML was built).
if (root.dataset.ssrPath === '/' && window.location.pathname === '/' && !window.location.search && root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

