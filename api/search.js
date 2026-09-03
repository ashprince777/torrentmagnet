const HEADER_CONFIGS = [
  {
    'User-Agent': 'curl/8.4.0',
    'Accept': '*/*',
  },
  {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
  },
  {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Accept': '*/*',
  },
  {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
    'Accept': 'application/json, text/plain, */*',
  },
];

async function fetchWithHeaders(url, headers) {
  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} [${headers['User-Agent']?.slice(0, 15)}]: ${errBody.slice(0, 60)}`);
  }
  const text = await res.text();
  const trimmed = text.trim();
  if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
    throw new Error(`Invalid JSON from ${url}`);
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

  const url = `https://apibay.org/q.php?q=${encodeURIComponent(q)}&cat=`;
  const promises = HEADER_CONFIGS.map((headers) => fetchWithHeaders(url, headers));

  try {
    const data = await Promise.any(promises);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(data);
  } catch (err) {
    const details = err.errors ? err.errors.map((e) => e.message) : [err.message];
    console.error('[search] All configs failed:', details);
    return res.status(503).json({ error: 'All mirrors failed', details });
  }
}
