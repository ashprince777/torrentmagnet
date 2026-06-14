const https = require('https');

const MIRRORS = [
  'https://apibay.org',
  'https://tpb.party',
  'https://thepiratebay.rocks',
  'https://piratebay.live',
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, */*',
        'Referer': 'https://thepiratebay.org/',
      },
      timeout: 8000,
    }, (res) => {
      if (res.statusCode >= 400) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} from ${url}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    });
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
    req.on('error', (err) => reject(new Error(`${err.message}: ${url}`)));
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'q parameter required' });

  // Race all mirrors in parallel — use whichever responds first
  const promises = MIRRORS.map((mirror) =>
    fetchUrl(`${mirror}/q.php?q=${encodeURIComponent(q)}&cat=`)
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
};
