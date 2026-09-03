export default async function handler(req, res) {
  const r = await fetch('https://thepiratebay10.org/search/fast/1/99/0', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    signal: AbortSignal.timeout(6000),
  });
  const html = await r.text();
  // Extract table rows from #searchResult or table
  const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  return res.status(200).json({
    rowCount: trMatches.length,
    sampleRows: trMatches.slice(1, 4),
  });
}
