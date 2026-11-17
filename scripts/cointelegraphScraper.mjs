const HOME_URL = 'https://cointelegraph.com/';
const RSS_URL = 'https://cointelegraph.com/rss';
const MAX_ITEMS = 12;

function decodeHtmlEntities(input) {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html) {
  return decodeHtmlEntities(html)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block, tagName) {
  const regex = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = block.match(regex);
  return match ? match[1].trim() : '';
}

function extractAllTags(block, tagName) {
  const regex = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  const results = [];
  let match;
  while ((match = regex.exec(block)) !== null) {
    const cleaned = stripHtml(match[1]);
    if (cleaned) results.push(cleaned);
  }
  return results;
}

function extractThumbnail(rawItem) {
  const mediaMatch = rawItem.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch) return decodeHtmlEntities(mediaMatch[1]).trim();

  const enclosureMatch = rawItem.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (enclosureMatch) return decodeHtmlEntities(enclosureMatch[1]).trim();

  const imgMatch = rawItem.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return decodeHtmlEntities(imgMatch[1]).trim();

  return '';
}

function cleanCointelegraphUrl(rawUrl) {
  const unwrapped = decodeHtmlEntities(rawUrl).trim();
  const normalized = unwrapped.startsWith('/') ? `https://cointelegraph.com${unwrapped}` : unwrapped;
  try {
    const parsed = new URL(normalized);
    parsed.searchParams.delete('utm_source');
    parsed.searchParams.delete('utm_medium');
    parsed.searchParams.delete('utm_campaign');
    return parsed.toString();
  } catch {
    return normalized;
  }
}

async function fetchTopCryptoStory() {
  try {
    const response = await fetch(HOME_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml'
      }
    });
    if (!response.ok) return null;

    const html = await response.text();
    const topIdx = html.indexOf('data-testid="post-top-crypto"');
    if (topIdx === -1) return null;

    const slice = html.slice(topIdx, topIdx + 6000);
    const hrefMatch = slice.match(/data-card-href=["']([^"']+)["']/i);
    const imgMatch = slice.match(/<img[^>]+src=["']([^"']+)["']/i);
    const titleMatch = slice.match(/data-testid=["']article-card-fancy__title["'][^>]*>([\s\S]*?)<\/h3>/i);
    const leadMatch = slice.match(/data-testid=["']article-card-fancy__lead["'][^>]*>([\s\S]*?)<\/p>/i);
    const authorMatch = slice.match(/<footer[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i);

    if (!hrefMatch || !titleMatch) return null;

    const url = cleanCointelegraphUrl(hrefMatch[1]);
    return {
      id: url.split('/').filter(Boolean).pop() || 'top-crypto-news',
      title: stripHtml(titleMatch[1]),
      url,
      source: 'Cointelegraph',
      author: authorMatch ? stripHtml(authorMatch[1]) : 'Cointelegraph',
      category: 'Top Crypto News Today',
      publishedAt: '',
      summary: leadMatch ? stripHtml(leadMatch[1]) : '',
      thumbnail: imgMatch ? decodeHtmlEntities(imgMatch[1]).trim() : '',
      isTopStory: true
    };
  } catch {
    return null;
  }
}

export async function scrapeCointelegraphNews() {
  const [topStory, rssResponse] = await Promise.all([
    fetchTopCryptoStory(),
    fetch(RSS_URL, {
      headers: {
        'User-Agent': 'JISOO-NewsAggregator/1.0 (+https://cointelegraph.com/rss)',
        Accept: 'application/rss+xml, application/xml, text/xml'
      }
    })
  ]);

  if (!rssResponse.ok) {
    throw new Error(`Failed to fetch Cointelegraph RSS: HTTP ${rssResponse.status}`);
  }

  const xml = await rssResponse.text();
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];

  const seenUrls = new Set();
  const items = [];

  for (const rawItem of itemMatches) {
    if (items.length >= MAX_ITEMS) break;

    const title = stripHtml(extractTag(rawItem, 'title'));
    const rawGuid = extractTag(rawItem, 'guid');
    const rawLink = extractTag(rawItem, 'link');
    const url = cleanCointelegraphUrl(rawGuid || rawLink);
    const pubDate = stripHtml(extractTag(rawItem, 'pubDate'));
    const description = stripHtml(extractTag(rawItem, 'description'));
    const creator = stripHtml(extractTag(rawItem, 'dc:creator'));
    const categories = extractAllTags(rawItem, 'category');
    const thumbnail = extractThumbnail(rawItem);

    if (!title || !url || seenUrls.has(url)) continue;
    seenUrls.add(url);

    const summary =
      description.length > 220 ? `${description.slice(0, 217).trimEnd()}...` : description;

    items.push({
      id: url.split('/').filter(Boolean).pop() || `ct-${items.length + 1}`,
      title,
      url,
      source: 'Cointelegraph',
      author: creator.replace(/^Cointelegraph by\s+/i, '').trim() || 'Cointelegraph',
      category: categories[0] || 'Latest News',
      publishedAt: pubDate,
      summary,
      thumbnail,
      isTopStory: topStory?.url === url
    });
  }

  let resolvedTopStory = topStory;
  if (topStory) {
    const rssMatch = items.find((item) => item.url === topStory.url);
    if (rssMatch) {
      resolvedTopStory = {
        ...topStory,
        author: rssMatch.author || topStory.author,
        publishedAt: rssMatch.publishedAt,
        summary: topStory.summary || rssMatch.summary,
        thumbnail: topStory.thumbnail || rssMatch.thumbnail
      };
    }
  } else if (items.length > 0) {
    resolvedTopStory = { ...items[0], isTopStory: true };
  }

  return {
    source: 'Cointelegraph',
    homeUrl: HOME_URL,
    feedUrl: RSS_URL,
    fetchedAt: new Date().toISOString(),
    topStory: resolvedTopStory,
    items: resolvedTopStory ? items.filter((item) => item.url !== resolvedTopStory.url) : items
  };
}
