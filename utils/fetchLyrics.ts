/**
 * Tries to extract lyrics from common Brazilian lyrics sites.
 * Uses direct fetch (works on native) with CORS proxy fallback (for web).
 */

const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

const LETRAS_SELECTORS = [
  // letras.mus.br - uses <div class="lyric-original">
  { host: 'letras.mus.br', selector: /<div[^>]*class="[^"]*lyric-original[^"]*"[^>]*>([\s\S]*?)<\/div>/i },
  // vagalume.com.br - uses <div id="lyrics">
  { host: 'vagalume.com.br', selector: /<div[^>]*id="lyrics"[^>]*>([\s\S]*?)<\/div>/i },
  // letras.com - uses <div class="lyric-original">
  { host: 'letras.com', selector: /<div[^>]*class="[^"]*lyric-original[^"]*"[^>]*>([\s\S]*?)<\/div>/i },
  // Generic fallback
  { host: '*', selector: /<div[^>]*class="[^"]*lyric-original[^"]*"[^>]*>([\s\S]*?)<\/div>/i },
  { host: '*', selector: /<div[^>]*class="[^"]*lyric[^"]*"[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/div>/i },
];

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .trim();
}

function extractLyrics(html: string, url: string): string | null {
  for (const { host, selector } of LETRAS_SELECTORS) {
    if (url.includes(host)) {
      const match = html.match(selector);
      if (match && match[1]) return stripHtml(match[1]);
    }
  }
  for (const { selector } of LETRAS_SELECTORS) {
    const match = html.match(selector);
    if (match && match[1]) return stripHtml(match[1]);
  }
  return null;
}

async function fetchWithFallback(url: string): Promise<string> {
  // Try direct fetch first (works on iOS/Android native)
  try {
    const res = await fetch(url);
    if (res.ok) return res.text();
  } catch {
    // CORS or network error, try proxies
  }

  // Try CORS proxies
  for (const proxyUrl of CORS_PROXIES) {
    try {
      const res = await fetch(proxyUrl(url));
      if (res.ok) return res.text();
    } catch {
      continue;
    }
  }

  throw new Error('All fetch attempts failed');
}

export async function fetchLyrics(url: string): Promise<string | null> {
  try {
    const html = await fetchWithFallback(url);
    return extractLyrics(html, url);
  } catch (e) {
    console.error('Failed to fetch lyrics:', e);
    return null;
  }
}
