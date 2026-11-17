export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface HeroChartSeries {
  id: "liquidity" | "equities" | "rates";
  label: string;
  subtitle: string;
  unit: string;
  points: { period: string; value: number; baseline: number }[];
}

export interface MarketSnapshotAsset {
  id: string;
  name: string;
  symbol: string;
  assetClass: "Digital Asset" | "Equity Index" | "Commodity" | "FX Index";
  priceFormatted: string;
  changePct: number;
  direction: "up" | "down";
  contextLabel: string;
}

export interface DisciplinePillar {
  index: string;
  title: string;
  description: string;
}

export interface IntelligenceCategory {
  index: string;
  title: string;
  summary: string;
  focusAreas: string;
}

export interface ResearchBrief {
  id: string;
  category: string;
  title: string;
  summary: string;
  dateLabel: string;
  readingTime: string;
  thesis: string;
  bullCase: string;
  bearCase: string;
  keyRisks: string[];
}

export interface DifferentiatorItem {
  index: string;
  title: string;
  detail: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "markets", label: "Markets", href: "#markets" },
  { id: "about", label: "About", href: "#about" },
  { id: "insights", label: "Insights", href: "#insights" },
  { id: "research", label: "Research", href: "#research" },
  { id: "news", label: "News", href: "#news" },
];

export const HERO_CHART_SERIES: HeroChartSeries[] = [
  {
    id: "liquidity",
    label: "Global Liquidity",
    subtitle: "Composite liquidity index vs. 12M baseline",
    unit: "pts",
    points: [
      { period: "Dec", value: 98.4, baseline: 100.0 },
      { period: "Jan", value: 99.6, baseline: 100.1 },
      { period: "Feb", value: 101.2, baseline: 100.4 },
      { period: "Mar", value: 100.8, baseline: 100.6 },
      { period: "Apr", value: 102.5, baseline: 100.9 },
      { period: "May", value: 103.9, baseline: 101.2 },
      { period: "Jun", value: 103.1, baseline: 101.5 },
      { period: "Jul", value: 104.8, baseline: 101.8 },
      { period: "Aug", value: 106.2, baseline: 102.1 },
      { period: "Sep", value: 105.7, baseline: 102.4 },
      { period: "Oct", value: 107.4, baseline: 102.8 },
      { period: "Nov", value: 108.9, baseline: 103.1 },
    ],
  },
  {
    id: "equities",
    label: "Asset Breadth",
    subtitle: "Multi-asset momentum vs. neutral trendline",
    unit: "pts",
    points: [
      { period: "Dec", value: 100.0, baseline: 100.0 },
      { period: "Jan", value: 101.4, baseline: 100.3 },
      { period: "Feb", value: 100.5, baseline: 100.6 },
      { period: "Mar", value: 102.9, baseline: 100.8 },
      { period: "Apr", value: 101.8, baseline: 101.1 },
      { period: "May", value: 104.2, baseline: 101.4 },
      { period: "Jun", value: 105.6, baseline: 101.7 },
      { period: "Jul", value: 104.9, baseline: 101.9 },
      { period: "Aug", value: 106.8, baseline: 102.2 },
      { period: "Sep", value: 108.1, baseline: 102.5 },
      { period: "Oct", value: 107.6, baseline: 102.7 },
      { period: "Nov", value: 109.4, baseline: 103.0 },
    ],
  },
  {
    id: "rates",
    label: "Real Yields",
    subtitle: "Policy-rate pressure vs. neutral real rate",
    unit: "bps",
    points: [
      { period: "Dec", value: 215, baseline: 195 },
      { period: "Jan", value: 208, baseline: 194 },
      { period: "Feb", value: 212, baseline: 193 },
      { period: "Mar", value: 204, baseline: 192 },
      { period: "Apr", value: 199, baseline: 190 },
      { period: "May", value: 195, baseline: 189 },
      { period: "Jun", value: 198, baseline: 188 },
      { period: "Jul", value: 191, baseline: 187 },
      { period: "Aug", value: 186, baseline: 185 },
      { period: "Sep", value: 182, baseline: 184 },
      { period: "Oct", value: 179, baseline: 183 },
      { period: "Nov", value: 174, baseline: 182 },
    ],
  },
];

export const MARKET_SNAPSHOT_DATA: MarketSnapshotAsset[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    assetClass: "Digital Asset",
    priceFormatted: "$91,420.00",
    changePct: 2.34,
    direction: "up",
    contextLabel: "Spot Reference (Sample)",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    assetClass: "Digital Asset",
    priceFormatted: "$3,185.50",
    changePct: 1.62,
    direction: "up",
    contextLabel: "Spot Reference (Sample)",
  },
  {
    id: "sp500",
    name: "S&P 500",
    symbol: "SPX",
    assetClass: "Equity Index",
    priceFormatted: "5,942.10",
    changePct: 0.48,
    direction: "up",
    contextLabel: "US Large Cap (Sample)",
  },
  {
    id: "nasdaq",
    name: "Nasdaq 100",
    symbol: "NDX",
    assetClass: "Equity Index",
    priceFormatted: "20,890.45",
    changePct: -0.31,
    direction: "down",
    contextLabel: "Tech & Growth (Sample)",
  },
  {
    id: "gold",
    name: "Gold",
    symbol: "XAU",
    assetClass: "Commodity",
    priceFormatted: "$2,618.80",
    changePct: 0.85,
    direction: "up",
    contextLabel: "Spot oz (Sample)",
  },
  {
    id: "dxy",
    name: "US Dollar Index",
    symbol: "DXY",
    assetClass: "FX Index",
    priceFormatted: "105.84",
    changePct: -0.27,
    direction: "down",
    contextLabel: "Trade-Weighted (Sample)",
  },
];

export const ABOUT_PILLARS: DisciplinePillar[] = [
  {
    index: "01",
    title: "Market Intelligence",
    description:
      "Cross-asset price structure across equities, sovereign yields, commodities, currencies, and digital assets.",
  },
  {
    index: "02",
    title: "Macroeconomic Research",
    description:
      "Inflation dynamics, central bank liquidity cycles, labor resilience, and real-rate transmission mechanisms.",
  },
  {
    index: "03",
    title: "Digital Asset Analysis",
    description:
      "Token supply schedules, fully diluted valuation discipline, on-chain liquidity, and sector fundamentals.",
  },
  {
    index: "04",
    title: "Investment Strategy",
    description:
      "Long-horizon capital compounding, disciplined allocation frameworks, and scenario-based risk management.",
  },
  {
    index: "05",
    title: "Financial Education",
    description:
      "First-principles explanations of duration risk, monetary regimes, valuation multiples, and portfolio correlation.",
  },
];

export const INTELLIGENCE_CATEGORIES: IntelligenceCategory[] = [
  {
    index: "01",
    title: "Global Markets",
    summary:
      "Cross-asset tracking spanning equity benchmarks, sovereign fixed income, energy, metals, and major FX pairs.",
    focusAreas: "Indices · Yields · Commodities · FX",
  },
  {
    index: "02",
    title: "Macroeconomic Intelligence",
    summary:
      "Structured monitoring of CPI, Core PCE, payrolls, PMI dispersion, and central bank policy trajectories.",
    focusAreas: "Inflation · Policy Rates · Liquidity · Growth",
  },
  {
    index: "03",
    title: "Digital Assets",
    summary:
      "Institutional-style token profiling emphasizing circulating vs. maximum supply, unlock schedules, and capital flows.",
    focusAreas: "BTC & ETH · Tokenomics · FDV Discipline",
  },
  {
    index: "04",
    title: "Research & Insights",
    summary:
      "Thesis-led briefs organized with explicit bullish cases, bearish counter-scenarios, and invalidation triggers.",
    focusAreas: "Theses · Bull / Bear Scenarios · Risk Notes",
  },
  {
    index: "05",
    title: "Investment Strategy",
    summary:
      "Quantitative capital simulators covering compounding velocity, recurring DCA discipline, and cross-asset correlation.",
    focusAreas: "Compounding · DCA · Asset Allocation",
  },
  {
    index: "06",
    title: "Financial Intelligence",
    summary:
      "Personal net-worth frameworks, investment journaling, and structured knowledge retention for independent thinkers.",
    focusAreas: "Portfolios · FIRE Modeling · Research Journal",
  },
];

export const FEATURED_RESEARCH: ResearchBrief[] = [
  {
    id: "btc-global-liquidity",
    category: "Digital Assets & Macro",
    title: "Understanding Bitcoin Through Global Liquidity",
    summary:
      "Why sovereign balance-sheet expansion, real yield direction, and dollar funding conditions often explain multi-quarter Bitcoin cycles better than isolated crypto narratives.",
    dateLabel: "Sample Brief · Illustrative Preview",
    readingTime: "6 min read",
    thesis:
      "Bitcoin behaves less like a conventional cash-flow asset and more like a high-beta liquidity barometer. Across multi-quarter regimes, changes in global net liquidity and US dollar financial conditions consistently precede major inflection points in digital asset risk appetite.",
    bullCase:
      "Easing real policy rates combined with stabilizing treasury issuance lowers global funding stress, allowing institutional spot allocations and sovereign diversification flows to compound on constrained post-halving supply.",
    bearCase:
      "Re-accelerating headline inflation forces central banks to hold restrictive real yields longer than consensus expects, tightening dollar liquidity and compressing speculative multiples across digital assets.",
    keyRisks: [
      "Sustained rise in US 10-year real yields above prior cycle highs.",
      "Sharp appreciation in DXY driven by non-US growth contraction.",
      "Regulatory or custody bottlenecks altering institutional ETF net inflows.",
    ],
  },
  {
    id: "fed-global-risk-assets",
    category: "Macroeconomic Strategy",
    title: "The Federal Reserve and Global Risk Assets",
    summary:
      "Decoding how policy-rate expectations, quantitative tightening pace, and term-premium repricing transmit across equity valuations and credit spreads.",
    dateLabel: "Sample Brief · Illustrative Preview",
    readingTime: "8 min read",
    thesis:
      "Market pricing reacts not merely to the level of the Federal Funds Rate, but to the second derivative of policy expectations and the long-end term premium. When growth cools without credit fracture, duration-sensitive equities stabilize; when term premia widen on fiscal supply, equity multiples face headwinds.",
    bullCase:
      "Gradual disinflation toward target permits a measured normalization cycle, steepening the curve constructively while corporate margins remain resilient.",
    bearCase:
      "Sticky services inflation or treasury supply pressure pushes long-end yields higher even as short-term rates pause, tightening financial conditions for leveraged sectors.",
    keyRisks: [
      "Policy error from premature easing followed by a secondary inflation wave.",
      "Rapid credit-spread widening among lower-tier corporate borrowers.",
      "Cross-currency volatility spillover from divergent G10 central bank paths.",
    ],
  },
  {
    id: "gold-treasury-yields",
    category: "Commodities & Fixed Income",
    title: "Gold, Treasury Yields, and the Changing Macro Environment",
    summary:
      "Examining the breakdown of traditional inverse real-yield correlations as sovereign reserve diversification and fiscal deficits reshape precious-metal demand.",
    dateLabel: "Sample Brief · Illustrative Preview",
    readingTime: "7 min read",
    thesis:
      "For two decades, gold tracked 10-year TIPS real yields tightly. Recent regimes demonstrate that sustained central bank reserve accumulation and sovereign debt trajectory concerns can elevate gold even during elevated real interest rates.",
    bullCase:
      "Continued reserve diversification by emerging-market central banks paired with persistent structural fiscal deficits creates a durable bid beneath physical bullion.",
    bearCase:
      "A credible fiscal consolidation path or sharp rise in real cash returns draws institutional capital back into sovereign money-market and treasury instruments.",
    keyRisks: [
      "Unexpected deceleration in official-sector gold purchases.",
      "Disinflationary recession driving a sudden flight into US dollar cash.",
      "Crowded speculative futures positioning creating sharp tactical pullbacks.",
    ],
  },
];

export const WHY_JISOO_ITEMS: DifferentiatorItem[] = [
  {
    index: "01",
    title: "Independent Perspective",
    detail:
      "Built without brokerage commissions, token promotions, or sensational media incentives—focused purely on analytical clarity.",
  },
  {
    index: "02",
    title: "Data-Driven Analysis",
    detail:
      "Every claim is anchored to verifiable market series, macro releases, and transparent mathematical assumptions.",
  },
  {
    index: "03",
    title: "Multi-Asset Coverage",
    detail:
      "Equities, sovereign fixed income, commodities, FX, and digital assets examined side by side within one unified model.",
  },
  {
    index: "04",
    title: "Macro-to-Market Perspective",
    detail:
      "Connects top-down monetary liquidity and inflation regimes directly to bottom-up asset behavior and portfolio risk.",
  },
  {
    index: "05",
    title: "Structured Investment Research",
    detail:
      "Replaces fragmented social feeds with thesis, bull/bear scenario framing, and explicit invalidation conditions.",
  },
  {
    index: "06",
    title: "Accessible Financial Intelligence",
    detail:
      "Institutional rigor presented through calm editorial typography and interactive quantitative tools anyone can operate.",
  },
];
