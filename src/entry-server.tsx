// Build-time only: renders a page to HTML so crawlers see headings and text without running JS
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { BlogPost, FAQItem } from './types';

export { PRERENDER_PATHS } from './utils/routes';
export { submitIndexNow } from './utils/indexnow';

export function render(blogs: BlogPost[], faqs: FAQItem[]) {
  const ctx: any = {};
  const html = renderToString(<HelmetProvider context={ctx}><App initialBlogs={blogs} initialFaqs={faqs} /></HelmetProvider>);
  const h = ctx.helmet;
  const head = h ? [h.title, h.meta, h.link, h.script].map((x: any) => x.toString()).join('\n') : '';
  return { html, head };
}
