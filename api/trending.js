const https = require('https');

const MIRRORS = [
  'https://apibay.org',
  'https://tpb.party',
  'https://thepiratebay.rocks',
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, */*',
      },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}`));
        else resolve(data);
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const errors = [];
  for (const mirror of MIRRORS) {
    const url = `${mirror}/precompiled/data_top100_all.json`;
    try {
      const data = await fetchUrl(url);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).send(data);
    } catch (err) {
      errors.push(`${mirror}: ${err.message}`);
    }
  }
  return res.status(503).json({ error: 'All mirrors failed', details: errors });
};
