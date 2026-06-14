const https = require('https');
const http = require('http');

const MIRRORS = [
  'https://apibay.org',
  'https://tpb.party',
  'https://thepiratebay.rocks',
  'https://piratebay.live',
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, */*',
        'Referer': 'https://thepiratebay.org/',
      },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
        } else {
          resolve(data);
        }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'q parameter required' });

  const errors = [];
  for (const mirror of MIRRORS) {
    const url = `${mirror}/q.php?q=${encodeURIComponent(q)}&cat=`;
    try {
      console.log(`[search] Trying: ${url}`);
      const data = await fetchUrl(url);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).send(data);
    } catch (err) {
      console.error(`[search] ${mirror} failed:`, err.message);
      errors.push(`${mirror}: ${err.message}`);
    }
  }

  return res.status(503).json({ error: 'All mirrors failed', details: errors });
};
