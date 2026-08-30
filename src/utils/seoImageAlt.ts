/**
 * Automated Helper Function for Dynamic, SEO-Optimized & Accessible Image Alt Tags
 * Generates context-rich, human-readable alt descriptions for images across the application.
 */

export interface ImageAltContext {
  title?: string;
  category?: string;
  page?: string;
  section?: string;
  author?: string;
  type?: 'logo' | 'hero' | 'blog' | 'classroom' | 'franchise' | 'pedagogy' | 'partner' | 'avatar' | 'general';
}

export function generateDescriptiveAlt(
  src?: string,
  context?: string | ImageAltContext,
  fallback?: string
): string {
  // If specific descriptive context is already provided and not generic
  if (typeof context === 'string' && context.trim().length > 4 && !isGenericAlt(context)) {
    return cleanAltText(context);
  }

  const ctx: ImageAltContext = typeof context === 'object' && context !== null ? context : {};

  // Case 1: Blog Post context
  if (ctx.title || ctx.type === 'blog') {
    const postTitle = ctx.title ? ` - ${ctx.title}` : '';
    const cat = ctx.category ? ` on ${ctx.category}` : ' Finnish Education';
    return `KinderBee Editorial Article Illustration${postTitle}${cat} - Nordic Pedagogy Research`;
  }

  // Case 2: Logo / Brand
  if (ctx.type === 'logo' || (src && src.toLowerCase().includes('logo'))) {
    return 'KinderBee International Preschool & FinnishWay Academy Official Brand Logo';
  }

  // Case 3: Specific Page & Section
  if (ctx.page) {
    if (ctx.page === 'franchise' || ctx.type === 'franchise') {
      return `KinderBee Zero Royalty Preschool Franchise Architecture & ${ctx.section || 'Classroom Setup Model'}`;
    }
    if (ctx.page === 'fwa' || ctx.type === 'pedagogy') {
      return `FinnishWay Academy Teacher Training & Nordic Play-Based Pedagogy Session`;
    }
    if (ctx.page === 'about') {
      return `KinderBee Integrated Educational Leadership & Global Curriculum Framework`;
    }
    if (ctx.page === 'investors') {
      return `KinderBee Integrated Partnership System (KIPS) Institutional Investment & School Development`;
    }
  }

  // Case 4: Parse meaningful tokens from image URL if available
  if (src) {
    const parsedFromUrl = parseKeywordsFromUrl(src);
    if (parsedFromUrl) {
      return `KinderBee Early Childhood Education - ${parsedFromUrl}`;
    }
  }

  // Case 5: Custom Fallback or Default Descriptive
  if (fallback && !isGenericAlt(fallback)) {
    return cleanAltText(fallback);
  }

  return 'KinderBee Finnish-Inspired Early Childhood Learning Environment & Preschool Setup in India';
}

function isGenericAlt(alt: string): boolean {
  const genericTerms = ['image', 'img', 'photo', 'picture', 'banner', 'logo', 'blog image', 'unnamed', 'test'];
  const lower = alt.trim().toLowerCase();
  return genericTerms.includes(lower) || lower.length < 3;
}

function cleanAltText(text: string): string {
  return text
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseKeywordsFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url, 'https://kinderbee.in').pathname;
    const filename = pathname.split('/').pop() || '';
    const nameWithoutExt = filename.split('.')[0];
    
    // Check if filename has meaningful alphanumeric words
    const cleaned = nameWithoutExt
      .replace(/[\d%_-]+/g, ' ')
      .replace(/\b(photo|image|banner|pic|unsplash|supabase|storage|object|public|website)\b/gi, '')
      .trim();

    if (cleaned.length > 4) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
  } catch {
    // URL parsing fallback
  }
  return null;
}
