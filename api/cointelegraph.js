import { scrapeCointelegraphNews } from '../scripts/cointelegraphScraper.mjs';

/**
 * Vercel Serverless Function: GET /api/cointelegraph
 * Caches live Cointelegraph top story & RSS items at Vercel Edge for 5 minutes.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = await scrapeCointelegraphNews();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(502).json({
      error: 'Failed to fetch Cointelegraph feed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
