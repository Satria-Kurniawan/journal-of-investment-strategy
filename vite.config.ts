import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { scrapeCointelegraphNews } from './scripts/cointelegraphScraper.mjs'
import { fetchMarketSnapshot } from './scripts/marketDataScraper.mjs'

function createCachedDevEndpoint(
  route: string,
  fetcher: () => Promise<unknown>,
  cacheMs: number,
  errorLabel: string
): Plugin {
  let cachedPayload: unknown = null
  let cachedAt = 0

  const middleware = async (
    req: { method?: string },
    res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (body: string) => void },
    next: () => void
  ) => {
    if (req.method !== 'GET') {
      return next()
    }
    try {
      const now = Date.now()
      if (!cachedPayload || now - cachedAt > cacheMs) {
        cachedPayload = await fetcher()
        cachedAt = now
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(cachedPayload))
    } catch (error) {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(
        JSON.stringify({
          error: errorLabel,
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      )
    }
  }

  return {
    name: `dev-api-${route.replace(/\W+/g, '-')}`,
    configureServer(server) {
      server.middlewares.use(route, middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(route, middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
    createCachedDevEndpoint(
      '/api/cointelegraph',
      scrapeCointelegraphNews,
      60_000,
      'Failed to fetch Cointelegraph feed'
    ),
    createCachedDevEndpoint(
      '/api/markets',
      fetchMarketSnapshot,
      60_000,
      'Failed to fetch market snapshot'
    ),
  ],
})
