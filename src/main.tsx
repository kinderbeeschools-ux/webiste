import React from 'react';
import { createRoot } from 'react-dom/client';
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

createRoot(root).render(app);

