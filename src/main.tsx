import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { captureAttribution } from './utils/attribution';

captureAttribution();
// index.html ships a description for crawlers; SEOHead sets the per-page one from here on
document.getElementById('static-description')?.remove();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

