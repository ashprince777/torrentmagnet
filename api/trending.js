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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, */*',
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
  if (req.method === 'OPTIONS') return res.status(200).end();

  const promises = MIRRORS.map((mirror) =>
    fetchUrl(`${mirror}/precompiled/data_top100_all.json`)
  );

  try {
    const data = await Promise.any(promises);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(data);
  } catch (err) {
    const details = err.errors ? err.errors.map((e) => e.message) : [err.message];
    return res.status(503).json({ error: 'All mirrors failed', details });
  }
};
