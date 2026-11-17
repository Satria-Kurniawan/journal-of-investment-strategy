const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true";

const YAHOO_TARGETS = [
  {
    id: "sp500",
    symbol: "^GSPC",
    isCurrency: false,
    contextLabel: "Yahoo Finance · Index",
  },
  {
    id: "nasdaq",
    symbol: "^NDX",
    isCurrency: false,
    contextLabel: "Yahoo Finance · Index",
  },
  {
    id: "gold",
    symbol: "GC=F",
    isCurrency: true,
    contextLabel: "Yahoo Finance · COMEX",
  },
  {
    id: "dxy",
    symbol: "DX-Y.NYB",
    isCurrency: false,
    contextLabel: "Yahoo Finance · ICE",
  },
];

const YAHOO_CRYPTO_FALLBACK = [
  {
    id: "bitcoin",
    symbol: "BTC-USD",
    isCurrency: true,
    contextLabel: "Yahoo Finance · Spot",
  },
  {
    id: "ethereum",
    symbol: "ETH-USD",
    isCurrency: true,
    contextLabel: "Yahoo Finance · Spot",
  },
];

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const YAHOO_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Accept: "application/json",
};

function formatValue(value, isCurrency) {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return isCurrency ? `$${formatted}` : formatted;
}

async function fetchYahooQuote(target) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(target.symbol)}?range=5d&interval=1d`;
  const res = await fetch(url, { headers: YAHOO_HEADERS });
  if (!res.ok) {
    throw new Error(`Yahoo ${target.symbol} HTTP ${res.status}`);
  }
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  const price = Number(meta?.regularMarketPrice);
  const prevClose = Number(meta?.chartPreviousClose ?? meta?.previousClose);

  if (!Number.isFinite(price)) {
    throw new Error(`Invalid price for ${target.symbol}`);
  }

  const rawChange =
    Number.isFinite(prevClose) && prevClose > 0
      ? ((price - prevClose) / prevClose) * 100
      : 0;
  const changePct = Math.round(rawChange * 100) / 100;

  return {
    id: target.id,
    priceFormatted: formatValue(price, target.isCurrency),
    changePct,
    direction: changePct >= 0 ? "up" : "down",
    contextLabel: target.contextLabel,
  };
}

async function fetchCoinGeckoCrypto() {
  const res = await fetch(COINGECKO_URL, {
    headers: {
      "User-Agent": "JISOO-MarketSnapshot/1.0",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`CoinGecko HTTP ${res.status}`);
  }
  const data = await res.json();
  const items = [];

  for (const id of ["bitcoin", "ethereum"]) {
    const entry = data?.[id];
    const price = Number(entry?.usd);
    const rawChange = Number(entry?.usd_24h_change);
    if (!Number.isFinite(price)) continue;

    const changePct = Number.isFinite(rawChange)
      ? Math.round(rawChange * 100) / 100
      : 0;
    items.push({
      id,
      priceFormatted: formatValue(price, true),
      changePct,
      direction: changePct >= 0 ? "up" : "down",
      contextLabel: "CoinGecko · Spot USD",
    });
  }

  if (items.length < 2) {
    throw new Error("Incomplete CoinGecko crypto payload");
  }
  return items;
}

async function fetchYahooMonthlySeries(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1mo`;
  const res = await fetch(url, { headers: YAHOO_HEADERS });
  if (!res.ok) {
    throw new Error(`Yahoo monthly ${symbol} HTTP ${res.status}`);
  }
  const data = await res.json();
  const result = data?.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const closes = result?.indicators?.quote?.[0]?.close ?? [];

  const points = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = Number(closes[i]);
    if (!Number.isFinite(close) || close <= 0) continue;
    const date = new Date(timestamps[i] * 1000);
    points.push({
      period: MONTH_NAMES[date.getUTCMonth()],
      close,
    });
  }

  // Keep the most recent 12 monthly observations
  return points.slice(-12);
}

function normalizeTo100(series) {
  if (series.length === 0) return [];
  const base = series[0].close || 1;
  return series.map((pt) => ({
    period: pt.period,
    index: (pt.close / base) * 100,
  }));
}

async function buildHeroSeries() {
  const [btcRes, goldRes, spxRes, rspRes, tnxRes] = await Promise.allSettled([
    fetchYahooMonthlySeries("BTC-USD"),
    fetchYahooMonthlySeries("GC=F"),
    fetchYahooMonthlySeries("^GSPC"),
    fetchYahooMonthlySeries("RSP"),
    fetchYahooMonthlySeries("^TNX"),
  ]);

  const series = [];

  if (
    btcRes.status === "fulfilled" &&
    goldRes.status === "fulfilled" &&
    spxRes.status === "fulfilled"
  ) {
    const btc = normalizeTo100(btcRes.value);
    const gold = normalizeTo100(goldRes.value);
    const spx = normalizeTo100(spxRes.value);
    const len = Math.min(btc.length, gold.length, spx.length);

    if (len >= 6) {
      const sliceOffsetBtc = btc.length - len;
      const sliceOffsetGold = gold.length - len;
      const sliceOffsetSpx = spx.length - len;

      const values = Array.from({ length: len }, (_, i) => {
        const val =
          0.25 * btc[sliceOffsetBtc + i].index +
          0.35 * gold[sliceOffsetGold + i].index +
          0.4 * spx[sliceOffsetSpx + i].index;
        return {
          period: spx[sliceOffsetSpx + i].period,
          value: Math.round(val * 10) / 10,
        };
      });

      const avg = values.reduce((acc, p) => acc + p.value, 0) / len;
      series.push({
        id: "liquidity",
        label: "Global Liquidity",
        subtitle:
          "Composite liquidity proxy (BTC, Gold, S&P 500) vs. 12M baseline",
        unit: "pts",
        points: values.map((pt, i) => ({
          period: pt.period,
          value: pt.value,
          baseline:
            Math.round((100 + ((avg - 100) * i) / Math.max(len - 1, 1)) * 10) /
            10,
        })),
      });
    }
  }

  if (rspRes.status === "fulfilled" && rspRes.value.length >= 6) {
    const rsp = normalizeTo100(rspRes.value);
    const len = rsp.length;
    const avg = rsp.reduce((acc, p) => acc + p.index, 0) / len;
    series.push({
      id: "equities",
      label: "Asset Breadth",
      subtitle: "S&P 500 Equal Weight (RSP) index vs. 12M trend",
      unit: "pts",
      points: rsp.map((pt, i) => ({
        period: pt.period,
        value: Math.round(pt.index * 10) / 10,
        baseline:
          Math.round((100 + ((avg - 100) * i) / Math.max(len - 1, 1)) * 10) /
          10,
      })),
    });
  }

  if (tnxRes.status === "fulfilled" && tnxRes.value.length >= 6) {
    const tnxPoints = tnxRes.value.map((pt) => ({
      period: pt.period,
      bps: Math.round(pt.close * 100),
    }));
    const avgBps = Math.round(
      tnxPoints.reduce((acc, p) => acc + p.bps, 0) / tnxPoints.length,
    );
    series.push({
      id: "rates",
      label: "Real Yields",
      subtitle: "10Y US Treasury yield (bps) vs. 12M average",
      unit: "bps",
      points: tnxPoints.map((pt) => ({
        period: pt.period,
        value: pt.bps,
        baseline: avgBps,
      })),
    });
  }

  return series;
}

export async function fetchMarketSnapshot() {
  const [cryptoRes, heroSeriesRes, ...yahooResults] = await Promise.allSettled([
    fetchCoinGeckoCrypto(),
    buildHeroSeries(),
    ...YAHOO_TARGETS.map((target) => fetchYahooQuote(target)),
  ]);

  const items = [];
  const sources = new Set();

  if (cryptoRes.status === "fulfilled") {
    items.push(...cryptoRes.value);
    sources.add("CoinGecko");
  } else {
    const fallbackResults = await Promise.allSettled(
      YAHOO_CRYPTO_FALLBACK.map((target) => fetchYahooQuote(target)),
    );
    for (const res of fallbackResults) {
      if (res.status === "fulfilled") {
        items.push(res.value);
        sources.add("Yahoo Finance");
      }
    }
  }

  for (const res of yahooResults) {
    if (res.status === "fulfilled") {
      items.push(res.value);
      sources.add("Yahoo Finance");
    }
  }

  if (items.length === 0) {
    throw new Error("All market data providers failed");
  }

  const heroSeries =
    heroSeriesRes.status === "fulfilled" && heroSeriesRes.value.length > 0
      ? heroSeriesRes.value
      : undefined;

  return {
    fetchedAt: new Date().toISOString(),
    sources: [...sources],
    items,
    ...(heroSeries ? { heroSeries } : {}),
  };
}
