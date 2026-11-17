export interface CointelegraphScrapedArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  author: string;
  category: string;
  publishedAt: string;
  summary: string;
  thumbnail: string;
  isTopStory: boolean;
}

export interface CointelegraphScrapedPayload {
  source: string;
  homeUrl: string;
  feedUrl: string;
  fetchedAt: string;
  topStory: CointelegraphScrapedArticle | null;
  items: CointelegraphScrapedArticle[];
}

export function scrapeCointelegraphNews(): Promise<CointelegraphScrapedPayload>;
