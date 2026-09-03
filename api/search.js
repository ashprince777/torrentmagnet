const SOURCES = [
  { name: 'apibay', url: 'https://apibay.org/q.php?q=fast&cat=' },
  { name: 'yts', url: 'https://yts.mx/api/v2/list_movies.json?query_term=fast' },
  { name: 'eztv', url: 'https://eztv.re/api/get-torrents?limit=10' },
  { name: 'nyaa', url: 'https://nyaa.si/?f=0&c=0_0&q=fast' },
  { name: '1337x', url: 'https://1337x.to/search/fast/1/' },
  { name: 'torrentgalaxy', url: 'https://torrentgalaxy.to/torrents.php?search=fast' },
  { name: 'bitsearch', url: 'https://bitsearch.to/search?q=fast' },
  { name: 'tpb10', url: 'https://thepiratebay10.org/search/fast/1/99/0' },
  { name: 'tpbproxy', url: 'https://piratebayproxy.net/search/fast/1/99/0' },
  { name: 'torlock', url: 'https://www.torlock.com/all/torrents/fast.html' },
  { name: 'solidtorrents', url: 'https://solidtorrents.to/api/v1/search?sort=seeders&q=fast' },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const results = await Promise.allSettled(
    SOURCES.map(async (src) => {
      const start = Date.now();
      const r = await fetch(src.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(5000),
      });
      const text = await r.text();
      return {
        name: src.name,
        status: r.status,
        length: text.length,
        time: Date.now() - start,
        hasMagnetOrJson: text.includes('magnet:?xt=') || text.startsWith('[') || text.startsWith('{'),
        preview: text.slice(0, 100),
      };
    })
  );

  const report = results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { name: SOURCES[i].name, error: r.reason?.message }
  );

  return res.status(200).json({ probe: report });
}
