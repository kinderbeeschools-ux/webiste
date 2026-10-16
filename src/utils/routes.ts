// One URL per page so search engines can index each one. First tab listed for a path is its canonical tab.
const PATHS: Record<string, string> = {
  home: '/',
  about: '/about',
  franchise: '/preschool-franchise',
  partnerships: '/preschool-franchise',
  'partnerships-preschool': '/preschool-franchise',
  'partnerships-cbse': '/cbse-school-setup',
  'partnerships-ib': '/cbse-school-setup',
  'partnerships-degree': '/degree-college-setup',
  fwa: '/teacher-training',
  programs: '/programs',
  'programs-overview': '/programs',
  'joint-ventures': '/joint-ventures',
  investors: '/investors',
  blogs: '/blog',
  contact: '/contact',
  payments: '/payments',
  'pay-fees': '/payments',
  'fee-payment': '/payments',
  'privacy-policy': '/privacy-policy',
  'terms-and-conditions': '/terms-and-conditions',
  terms: '/terms-and-conditions',
  'cancellation-refund': '/cancellation-refund',
  'refund-policy': '/cancellation-refund',
  admin: '/admin',
};

export const pathFor = (tab: string, blogId?: string) =>
  tab === 'blogs' && blogId ? `/blog/${encodeURIComponent(blogId)}` : PATHS[tab] || '/';

const clean = (path: string) => path.toLowerCase().replace(/\/+$/, '') || '/';

export const tabFor = (path: string): string | null => {
  const p = clean(path);
  if (p.startsWith('/blog/')) return 'blogs';
  return Object.keys(PATHS).find(tab => PATHS[tab] === p) || null;
};

export const blogIdFor = (path: string) => {
  const m = path.match(/^\/blog\/([^/]+)\/?$/i);
  return m ? decodeURIComponent(m[1]) : null;
};

// Pages written out as static HTML at build time (payments and admin stay client-only)
export const PRERENDER_PATHS = [...new Set(Object.values(PATHS))].filter(p => p !== '/admin' && p !== '/payments');
