const MIRRORS = [
  'https://apibay.org',
  'https://tpb.party',
  'https://thepiratebay.rocks',
  'https://piratebay.live',
];

async function fetchMirror(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, */*',
      'Referer': 'https://thepiratebay.org/',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} from ${url} | body: ${errBody.slice(0, 150)}`);
  }
  const text = await res.text();
  const trimmed = text.trim();
  if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
    throw new Error(`Invalid JSON response from ${url}`);
  }
  return text;
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

  // Race all mirrors in parallel — use whichever responds first
  const promises = MIRRORS.map((mirror) =>
    fetchMirror(`${mirror}/q.php?q=${encodeURIComponent(q)}&cat=`)
  );

  try {
    const data = await Promise.any(promises);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(data);
  } catch (err) {
    const details = err.errors ? err.errors.map((e) => e.message) : [err.message];
    console.error('[search] All mirrors failed:', details);
    return res.status(503).json({ error: 'All mirrors failed', details });
  }
}
