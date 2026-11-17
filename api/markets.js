import { fetchMarketSnapshot } from '../scripts/marketDataScraper.mjs';

/**
 * Vercel Serverless Function: GET /api/markets
 * Caches live market quotes at Vercel Edge for 2 minutes.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = await fetchMarketSnapshot();
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(502).json({
      error: 'Failed to fetch market snapshot',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
