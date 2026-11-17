export interface MarketQuotePatch {
  id: string;
  priceFormatted: string;
  changePct: number;
  direction: 'up' | 'down';
  contextLabel: string;
}

export interface MarketSnapshotPayload {
  fetchedAt: string;
  sources: string[];
  items: MarketQuotePatch[];
}

export function fetchMarketSnapshot(): Promise<MarketSnapshotPayload>;
