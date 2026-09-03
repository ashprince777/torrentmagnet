function parseBytes(numStr, unit) {
  const n = parseFloat(numStr);
  const u = (unit || '').toUpperCase();
  if (u.includes('G')) return Math.round(n * 1024 * 1024 * 1024);
  if (u.includes('M')) return Math.round(n * 1024 * 1024);
  if (u.includes('K')) return Math.round(n * 1024);
  return Math.round(n);
}

function parseDate(dateStr) {
  if (!dateStr) return Math.floor(Date.now() / 1000);
  const clean = dateStr.replace(/&nbsp;/g, ' ').trim();
  const m1 = clean.match(/^(\d{2})-(\d{2})\s+(\d{4})$/);
  if (m1) {
    const d = new Date(`${m1[3]}-${m1[1]}-${m1[2]}`);
    if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
  }
  const m2 = clean.match(/^(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
  if (m2) {
    const year = new Date().getFullYear();
    const d = new Date(`${year}-${m2[1]}-${m2[2]}T${m2[3]}:${m2[4]}:00`);
    if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
  }
  return Math.floor(Date.now() / 1000);
}

function parseRow(rowHtml) {
  const magnetMatch = rowHtml.match(/magnet:\?xt=urn:btih:([a-zA-Z0-9]+)/i);
  if (!magnetMatch) return null;
  const info_hash = magnetMatch[1];

  const titleMatch =
    rowHtml.match(/title="Details for ([^"]+)"/i) ||
    rowHtml.match(/<a[^>]*torrent\/\d+\/[^>]*>([^<]+)<\/a>/i);
  const name = titleMatch ? titleMatch[1] : 'Unknown Torrent';

  const idMatch = rowHtml.match(/torrent\/(\d+)\//i);
  const id = idMatch ? idMatch[1] : info_hash;

  const catMatch = rowHtml.match(/browse\/(\d+)/i);
  const category = catMatch ? catMatch[1] : '200';

  const sizeMatch = rowHtml.match(
    /<td[^>]*align="right"[^>]*>([0-9.]+)(?:&nbsp;|\s*)([KMGT]?i?B)<\/td>/i
  );
  const size = sizeMatch ? String(parseBytes(sizeMatch[1], sizeMatch[2])) : '0';

  const tdNumbers = [
    ...rowHtml.matchAll(/<td[^>]*align="right"[^>]*>\s*(\d+)\s*<\/td>/gi),
  ].map((m) => m[1]);
  const seeders = tdNumbers[0] || '0';
  const leechers = tdNumbers[1] || '0';

  const dateMatch = rowHtml.match(/<td>(\d{2}-\d{2}(?:&nbsp;|\s+)(?:\d{4}|\d{2}:\d{2}))<\/td>/i);
  const added = String(parseDate(dateMatch ? dateMatch[1] : ''));

  const status = rowHtml.includes('vip.gif')
    ? 'vip'
    : rowHtml.includes('trusted.gif')
    ? 'trusted'
    : 'member';

  return {
    id,
    name,
    info_hash,
    leechers,
    seeders,
    num_files: '1',
    size,
    username: '',
    added,
    status,
    category,
    imdb: '',
  };
}

function parseTpbHtml(html) {
  const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  const results = [];
  for (const row of trMatches) {
    const item = parseRow(row);
    if (item && item.info_hash) {
      results.push(item);
    }
  }
  return results;
}

async function searchFromTpbMirror(query) {
  const url = `https://thepiratebay10.org/search/${encodeURIComponent(query)}/1/99/0`;
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`TPB mirror status ${res.status}`);
  const html = await res.text();
  const items = parseTpbHtml(html);
  if (!items || items.length === 0) {
    if (html.includes('No hits') || html.includes('No results')) return [];
    throw new Error('No items parsed from TPB mirror');
  }
  return items;
}

async function searchFromApibay(query) {
  const url = `https://apibay.org/q.php?q=${encodeURIComponent(query)}&cat=`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'curl/8.4.0',
      Accept: 'application/json, */*',
    },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`apibay status ${res.status}`);
  const text = await res.text();
  if (!text.trim().startsWith('[')) throw new Error('apibay non-JSON response');
  return JSON.parse(text);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let q = req.query?.q;
  if (!q && req.url) {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      q = urlObj.searchParams.get('q');
    } catch {
      // ignore
    }
  }

  if (!q) return res.status(400).json({ error: 'q parameter required' });

  // Race/fallback between thepiratebay10.org (works on Vercel) and apibay.org
  try {
    const results = await Promise.any([
      searchFromTpbMirror(q),
      searchFromApibay(q),
    ]);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(results);
  } catch (err) {
    const details = err.errors ? err.errors.map((e) => e.message) : [err.message];
    console.error('[search] All providers failed:', details);
    return res.status(503).json({ error: 'All providers failed', details });
  }
}
