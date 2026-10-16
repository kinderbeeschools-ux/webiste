// Writes dist/<page>/index.html with the page already rendered, plus sitemap.xml and robots.txt.
// The app reads window/localStorage while rendering, so each page renders under a minimal browser stand-in.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE = 'https://www.kinderbeeschools.com';
const dist = path.resolve('dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const store = {};
const noop = () => {};
globalThis.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
globalThis.window = globalThis;
Object.assign(globalThis, { addEventListener: noop, removeEventListener: noop, scrollTo: noop, matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }) });
const setUrl = p => { globalThis.location = new URL(p, SITE); };
setUrl('/');

const { render, PRERENDER_PATHS, submitIndexNow } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);

// Posts and FAQs as the live API serves them (database + seeded journal posts); db.json if the API can't be reached.
// Posts added after a build still work client-side until the next build.
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
const live = async key => {
  try {
    const r = await fetch(`${SITE}/api/${key}`, { signal: AbortSignal.timeout(10000) });
    const data = r.ok ? await r.json() : null;
    if (Array.isArray(data) && data.length) return data;
  } catch {}
  console.warn(`prerender: /api/${key} unavailable, using db.json`);
  return db[key] || [];
};
const blogs = (await live('blogs')).filter(b => !b.status || b.status === 'Published');
const faqs = await live('faqs');
const pages = [...PRERENDER_PATHS, ...blogs.map(b => `/blog/${encodeURIComponent(b.id)}`)];
const built = {};
// '/404' isn't a real route, so it renders the not-found page; Vercel serves 404.html with a 404 status
for (const p of [...pages, '/404']) {
  setUrl(p);
  const { html, head } = render(blogs, faqs);
  if (!/<h1[\s>]/.test(html)) console.warn(`prerender: no <h1> on ${p}`);
  const out = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description" id="static-description"[^>]*>\s*/, '')
    .replace('</head>', `${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  const file = path.join(dist, p === '/' ? 'index.html' : p === '/404' ? '404.html' : `${decodeURIComponent(p)}/index.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  built[p] = out;
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`prerender: ${pages.length} pages`);

// IndexNow: on production builds, submit only the pages whose content differs from the live site.
// Script and stylesheet tags are ignored because their file names change on every build.
// ponytail: runs during the build, a minute before the deploy is live; Bing recrawls later than that in practice.
if (process.env.VERCEL_ENV === 'production' || process.env.INDEXNOW_DRY) {
  const fingerprint = html => html.replace(/<script[\s\S]*?<\/script>|<link[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const changed = (await Promise.all(pages.map(async p => {
    try {
      const r = await fetch(SITE + p, { signal: AbortSignal.timeout(8000) });
      return r.ok && fingerprint(await r.text()) === fingerprint(built[p]) ? null : p;
    } catch {
      return p;
    }
  }))).filter(Boolean);
  if (process.env.INDEXNOW_DRY) console.log(`indexnow (dry run): ${changed.length} changed`, changed);
  else if (changed.length) console.log(`indexnow: submitted ${changed.length} changed page(s), status ${await submitIndexNow(changed)}`);
  else console.log('indexnow: no page changes to submit');
}
fs.rmSync('dist-ssr', { recursive: true, force: true });
