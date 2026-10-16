// IndexNow (Bing, Yandex, Seznam, Naver): tells search engines a page changed so they recrawl it within hours.
// The key is public by design; it must match the file /<key>.txt served from the site root (public/).
export const INDEXNOW_SITE = 'https://www.kinderbeeschools.com';
export const INDEXNOW_KEY = '6857059fc1f743dfebb7f880e551ba15';

// Submits site paths (e.g. "/blog/my-post"). Resolves to the HTTP status (200/202 = accepted), or null on failure.
export async function submitIndexNow(paths: string[]): Promise<number | null> {
  if (!paths.length) return null;
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(INDEXNOW_SITE).host,
        key: INDEXNOW_KEY,
        keyLocation: `${INDEXNOW_SITE}/${INDEXNOW_KEY}.txt`,
        urlList: paths.map(p => INDEXNOW_SITE + p),
      }),
      signal: AbortSignal.timeout(5000),
    });
    return res.status;
  } catch {
    return null;
  }
}
