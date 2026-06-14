import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'
import http from 'http'
import type { IncomingMessage, ServerResponse } from 'http'

const MIRRORS = [
  'https://apibay.org',
  'https://tpb.party',
  'https://thepiratebay.rocks',
  'https://piratebay.live',
]

function fetchFromMirror(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, */*',
        'Referer': 'https://thepiratebay.org/',
      },
      timeout: 10000,
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        if ((res.statusCode ?? 0) >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`))
        } else {
          resolve(data)
        }
      })
    })
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
    req.on('error', reject)
  })
}

async function tryMirrors(buildPath: (mirror: string) => string): Promise<string> {
  const errors: string[] = []
  for (const mirror of MIRRORS) {
    const url = buildPath(mirror)
    try {
      console.log(`[torrent-api] Trying: ${url}`)
      const data = await fetchFromMirror(url)
      return data
    } catch (err: any) {
      console.error(`[torrent-api] ${mirror} failed:`, err.message)
      errors.push(`${mirror}: ${err.message}`)
    }
  }
  throw new Error(`All mirrors failed: ${errors.join(' | ')}`)
}

function torrentApiPlugin() {
  return {
    name: 'torrent-api',
    configureServer(server: any) {
      // Handle search: GET /api/search?q=QUERY
      server.middlewares.use('/api/search', async (req: IncomingMessage, res: ServerResponse, _next: () => void) => {
        const urlObj = new URL(req.url ?? '/', 'http://localhost')
        const q = urlObj.searchParams.get('q')
        if (!q) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'q parameter required' }))
          return
        }
        try {
          const data = await tryMirrors((m) => `${m}/q.php?q=${encodeURIComponent(q)}&cat=`)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(data)
        } catch (err: any) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })

      // Handle trending: GET /api/trending
      server.middlewares.use('/api/trending', async (_req: IncomingMessage, res: ServerResponse, _next: () => void) => {
        try {
          const data = await tryMirrors((m) => `${m}/precompiled/data_top100_all.json`)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(data)
        } catch (err: any) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })

      // Handle recent: GET /api/recent
      server.middlewares.use('/api/recent', async (_req: IncomingMessage, res: ServerResponse, _next: () => void) => {
        try {
          const data = await tryMirrors((m) => `${m}/precompiled/data_top100_recent.json`)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(data)
        } catch (err: any) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), torrentApiPlugin()],
})
