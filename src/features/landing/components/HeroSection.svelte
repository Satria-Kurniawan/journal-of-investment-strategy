<script lang="ts">
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { onMount } from 'svelte';
  import { HERO_CHART_SERIES, type HeroChartSeries } from '../data/landingData';

  interface HeroTicker {
    id: string;
    label: string;
    shortLabel: string;
    price: string;
    change: string;
    positive: boolean;
  }

  interface MarketPatch {
    id: string;
    priceFormatted: string;
    changePct: number;
    direction: 'up' | 'down';
  }

  interface HeroMarketsPayload {
    fetchedAt?: string;
    items?: MarketPatch[];
    heroSeries?: HeroChartSeries[];
  }

  const INITIAL_HERO_TICKERS: HeroTicker[] = [
    { id: 'bitcoin', label: 'Bitcoin (BTC)', shortLabel: 'BTC', price: '$91,420', change: '+2.34%', positive: true },
    { id: 'sp500', label: 'S&P 500', shortLabel: 'S&P 500', price: '5,942.10', change: '+0.48%', positive: true },
    { id: 'gold', label: 'Gold (XAU)', shortLabel: 'Gold', price: '$2,618.80', change: '+0.85%', positive: true }
  ];

  let heroTickers = $state<HeroTicker[]>(INITIAL_HERO_TICKERS);
  let heroChartSeries = $state<HeroChartSeries[]>(HERO_CHART_SERIES);
  let isLive = $state(false);
  let fetchedAt = $state<string | null>(null);

  let activeSeriesId = $state<HeroChartSeries['id']>('liquidity');
  let hoveredIndex = $state<number | null>(null);

  let heroEl = $state<HTMLElement | null>(null);
  let scrollProgress = $state(0);
  let reducedMotion = $state(false);

  onMount(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mq.matches;

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) scrollProgress = 0;
    };
    mq.addEventListener('change', handleMotionChange);

    let rafId = 0;

    const updateParallax = () => {
      rafId = 0;
      if (reducedMotion || !heroEl) {
        scrollProgress = 0;
        return;
      }
      const rect = heroEl.getBoundingClientRect();
      const scrollDistance = Math.max(rect.height * 0.52, 360);
      const raw = -rect.top / scrollDistance;
      scrollProgress = Math.max(0, Math.min(1, raw));
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    const controller = new AbortController();
    fetch('/api/markets', {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as HeroMarketsPayload;

        if (Array.isArray(data.items) && data.items.length > 0) {
          const patchMap = new Map(data.items.map((item) => [item.id, item]));
          heroTickers = INITIAL_HERO_TICKERS.map((base) => {
            const patch = patchMap.get(base.id);
            if (!patch) return base;
            const sign = patch.changePct >= 0 ? '+' : '';
            return {
              ...base,
              price: patch.priceFormatted,
              change: `${sign}${patch.changePct.toFixed(2)}%`,
              positive: patch.direction === 'up'
            };
          });
          isLive = true;
          fetchedAt = data.fetchedAt ?? null;
        }

        if (Array.isArray(data.heroSeries) && data.heroSeries.length > 0) {
          const seriesMap = new Map(data.heroSeries.map((s) => [s.id, s]));
          heroChartSeries = HERO_CHART_SERIES.map((base) => seriesMap.get(base.id) ?? base);
          isLive = true;
        }
      })
      .catch(() => {
        // Keep fallback preview values when offline or static
      });

    return () => {
      controller.abort();
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mq.removeEventListener('change', handleMotionChange);
    };
  });

  const liveTimestamp = $derived.by(() => {
    if (!fetchedAt) return '';
    const parsed = new Date(fetchedAt);
    if (Number.isNaN(parsed.getTime())) return '';
    return (
      new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      }).format(parsed) + ' UTC'
    );
  });

  // Symmetrical, collision-free Apple-style scroll parallax (disabled under prefers-reduced-motion)
  const copyTranslateY = $derived(reducedMotion ? 0 : -scrollProgress * 22);
  const copyOpacity = $derived(reducedMotion ? 1 : Math.max(0.2, 1 - scrollProgress * 0.78));

  const macProgress = $derived(reducedMotion ? 1 : Math.min(1, scrollProgress * 1.2));
  const macTranslateY = $derived(reducedMotion ? 0 : 12 - macProgress * 44);
  const macScale = $derived(reducedMotion ? 1 : 0.93 + macProgress * 0.07);

  const innerChartY = $derived(reducedMotion ? 0 : -macProgress * 6);

  const activeSeries = $derived(
    heroChartSeries.find((series) => series.id === activeSeriesId) ?? heroChartSeries[0]
  );

  const chartBounds = $derived.by(() => {
    const allValues = activeSeries.points.flatMap((p) => [p.value, p.baseline]);
    const minRaw = Math.min(...allValues);
    const maxRaw = Math.max(...allValues);
    const padding = (maxRaw - minRaw) * 0.24 || 1;
    return {
      min: minRaw - padding,
      max: maxRaw + padding
    };
  });

  const SVG_WIDTH = 720;
  const SVG_HEIGHT = 210;
  const PAD_LEFT = 42;
  const PAD_RIGHT = 14;
  const PAD_TOP = 16;
  const PAD_BOTTOM = 28;
  const PLOT_W = SVG_WIDTH - PAD_LEFT - PAD_RIGHT;
  const PLOT_H = SVG_HEIGHT - PAD_TOP - PAD_BOTTOM;

  function xFor(index: number, count: number): number {
    if (count <= 1) return PAD_LEFT;
    return PAD_LEFT + (index / (count - 1)) * PLOT_W;
  }

  function yFor(value: number, min: number, max: number): number {
    const ratio = (value - min) / (max - min || 1);
    return PAD_TOP + PLOT_H - ratio * PLOT_H;
  }

  const plottedPoints = $derived(
    activeSeries.points.map((pt, i) => ({
      ...pt,
      x: xFor(i, activeSeries.points.length),
      y: yFor(pt.value, chartBounds.min, chartBounds.max),
      yBaseline: yFor(pt.baseline, chartBounds.min, chartBounds.max)
    }))
  );

  const primaryLinePath = $derived(
    plottedPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')
  );

  const baselinePath = $derived(
    plottedPoints
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.yBaseline.toFixed(1)}`)
      .join(' ')
  );

  const areaPath = $derived.by(() => {
    if (plottedPoints.length === 0) return '';
    const first = plottedPoints[0];
    const last = plottedPoints[plottedPoints.length - 1];
    const bottomY = PAD_TOP + PLOT_H;
    return `${primaryLinePath} L ${last.x.toFixed(1)} ${bottomY} L ${first.x.toFixed(1)} ${bottomY} Z`;
  });

  const yTicks = $derived.by(() => {
    const { min, max } = chartBounds;
    const mid = (min + max) / 2;
    return [max, mid, min].map((val) => ({
      val,
      label: activeSeries.unit === 'bps' ? `${Math.round(val)}` : val.toFixed(1),
      y: yFor(val, min, max)
    }));
  });

  const focusedPoint = $derived(
    hoveredIndex !== null ? plottedPoints[hoveredIndex] : plottedPoints[plottedPoints.length - 1]
  );

  const deltaFromBaseline = $derived(focusedPoint.value - focusedPoint.baseline);

  function handleChartPointerMove(event: PointerEvent): void {
    const target = event.currentTarget as SVGSVGElement;
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0) return;
    const relX = ((event.clientX - rect.left) / rect.width) * SVG_WIDTH;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < plottedPoints.length; i++) {
      const dist = Math.abs(plottedPoints[i].x - relX);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    hoveredIndex = closest;
  }

  function handleChartPointerLeave(): void {
    hoveredIndex = null;
  }

  function selectSeries(id: HeroChartSeries['id']): void {
    activeSeriesId = id;
    hoveredIndex = null;
  }
</script>

<section id="overview" class="overflow-hidden border-b border-line py-10 md:py-12 lg:py-16" bind:this={heroEl}>
  <div class="mx-auto flex w-full max-w-[1240px] flex-col items-center px-5 sm:px-6 lg:px-8">
    <!-- Minimal Apple-Inspired Typographic Header -->
    <div
      class="mb-8 flex max-w-[680px] flex-col items-center text-center will-change-[transform,opacity] sm:mb-12"
      style:transform={`translate3d(0, ${copyTranslateY.toFixed(2)}px, 0)`}
      style:opacity={copyOpacity}
    >
      <h1 class="mb-2 text-[clamp(2rem,9vw,2.625rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-ink animate-hero-enter sm:text-[clamp(2.5rem,5.2vw,3.875rem)]">
        Understand Markets.
      </h1>
      <p class="mb-4 text-[20px] leading-tight font-medium tracking-[-0.02em] text-ink animate-hero-enter [animation-delay:50ms] sm:text-[clamp(1.375rem,2.5vw,1.875rem)]">
        Discover <span class="text-ink-muted">Opportunities.</span>
      </p>
      <p class="mb-6 max-w-[480px] text-[15px] leading-[1.6] text-ink-secondary animate-hero-enter [animation-delay:50ms]">
        Independent financial intelligence for global markets, macro trends, and digital assets.
      </p>

      <div class="flex w-full flex-wrap items-center justify-center gap-3 animate-hero-enter [animation-delay:100ms] sm:w-auto">
        <a
          href="#markets"
          class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-transparent bg-brand px-4 text-sm font-medium whitespace-nowrap text-brand-fg transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover active:scale-[0.975] sm:w-auto"
        >
          <span>Explore Intelligence</span>
          <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </a>
        <a
          href="#about"
          class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-line-strong bg-surface px-4 text-sm font-medium whitespace-nowrap text-ink transition-[background-color,border-color,transform] duration-150 ease-out hover:border-ink-muted hover:bg-elevated active:scale-[0.975] sm:w-auto"
        >
          Discover JISOO
        </a>
      </div>
    </div>

    <!-- Clean MacBook Pro Hardware Showcase (Strict Orthogonal Symmetry) -->
    <div class="mx-auto w-full max-w-[860px] animate-hero-enter [animation-delay:100ms]">
      <div class="w-full">
        <div
          class="relative flex w-full origin-top flex-col items-center will-change-transform"
          style:transform={`translate3d(0, ${macTranslateY.toFixed(2)}px, 0) scale(${macScale.toFixed(4)})`}
        >
          <!-- Upper Lid: Chamfered Aluminum Frame + Black Bezel + Signature Notch -->
          <div class="mx-auto w-[94%] rounded-t-xl rounded-b-[3px] bg-[linear-gradient(180deg,#d4d8e0_0%,#9ca3af_16%,#4b5563_72%,#272b33_100%)] p-[2px_2px_1.5px] shadow-[0_-1px_0_rgba(255,255,255,0.7),0_18px_40px_-16px_rgba(15,23,42,0.18)] dark:bg-[linear-gradient(180deg,#646c7b_0%,#3d434f_18%,#22262f_75%,#14171d_100%)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.2),0_22px_48px_-16px_rgba(0,0,0,0.6)] sm:w-[88%] sm:rounded-t-[20px] sm:rounded-b-[4px] sm:p-[2.5px_2.5px_2px]">
            <div class="relative rounded-t-[10px] rounded-b-[2px] bg-[#08090c] p-[5px_5px_6px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:rounded-t-[17.5px] sm:p-[9px_9px_13px]">
              <!-- Authentic MacBook Pro Camera Notch -->
              <div
                class="absolute top-[4px] left-1/2 z-5 flex h-[8px] w-[48px] -translate-x-1/2 items-center justify-center rounded-b-[5px] bg-[#08090c] sm:top-[8px] sm:h-[15px] sm:w-[86px] sm:rounded-b-[7px]"
                aria-hidden="true"
              >
                <span class="h-[2.5px] w-[2.5px] rounded-full bg-[#1c2230] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] sm:h-[4.5px] sm:w-[4.5px]"></span>
              </div>

              <!-- Calm Inside-Screen JISOO Workspace -->
              <div
                class="relative overflow-hidden rounded-t-[7px] rounded-b-[2px] bg-background text-left sm:rounded-t-[9px] sm:rounded-b-[3px]"
                aria-label="JISOO MacBook Workspace Preview"
              >
                <div
                  class="pointer-events-none absolute inset-0 z-4 bg-[linear-gradient(115deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.04)_24%,transparent_48%)] dark:bg-[linear-gradient(115deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_24%,transparent_48%)]"
                  aria-hidden="true"
                ></div>

                <!-- Minimal Top Status Strip Flanking the Notch -->
                <div class="flex h-4 items-center justify-between border-b border-line bg-surface px-2 sm:h-6 sm:px-3.5">
                  <span class="text-[8px] font-semibold tracking-[0.14em] text-ink sm:text-[10px]">
                    JISOO
                  </span>
                  <span class="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-[0.06em] text-ink-muted sm:text-[9px]">
                    {#if isLive}
                      <span class="h-1.5 w-1.5 rounded-full bg-positive" aria-hidden="true"></span>
                      <span>LIVE{liveTimestamp ? ` · ${liveTimestamp}` : ''}</span>
                    {:else}
                      <span>SAMPLE PREVIEW</span>
                    {/if}
                  </span>
                </div>

                <!-- Clean Spacious Workspace Interior -->
                <div class="flex flex-col gap-[7px] p-[8px_9px_9px] sm:gap-3 sm:p-[12px_14px_14px] md:gap-4 md:p-[18px_24px_20px]">
                  <!-- Quiet 3-Metric Strip (Always Horizontal Row) -->
                  <div class="grid grid-cols-3 rounded-md border border-line bg-surface">
                    {#each heroTickers as item (item.id)}
                      <div class="flex flex-col gap-px border-r border-line px-[7px] py-[5px] last:border-r-0 sm:gap-[3px] sm:px-3.5 sm:py-2.5">
                        <span class="hidden text-[11px] text-ink-muted sm:block">{item.label}</span>
                        <span class="block text-[9px] text-ink-muted sm:hidden">{item.shortLabel}</span>
                        <div class="flex items-baseline justify-between gap-1 tabular-nums sm:gap-2">
                          <span class="text-[11px] font-semibold text-ink sm:text-sm">{item.price}</span>
                          <span
                            class="text-[9px] font-medium sm:text-xs {item.positive
                              ? 'text-positive'
                              : 'text-negative'}"
                          >
                            {item.change}
                          </span>
                        </div>
                      </div>
                    {/each}
                  </div>

                  <!-- Single Spacious Interactive Chart -->
                  <div class="overflow-hidden rounded-md border border-line bg-surface px-2.5 pt-2 pb-1.5 sm:px-[18px] sm:pt-4 sm:pb-3">
                    <div class="mb-1 flex items-center justify-between gap-2 sm:mb-2.5 sm:items-start sm:gap-3">
                      <div>
                        <h2 class="text-[11px] leading-tight font-semibold text-ink sm:text-sm">
                          {activeSeries.id === 'liquidity' ? 'Composite Liquidity Index' : activeSeries.label}
                        </h2>
                        <p class="mt-0.5 hidden text-xs text-ink-muted sm:block">
                          {activeSeries.subtitle}
                        </p>
                      </div>
                      <div class="shrink-0 text-right tabular-nums">
                        <span class="block text-xs leading-tight font-semibold text-ink sm:text-[17px]">
                          {activeSeries.unit === 'bps'
                            ? `${Math.round(focusedPoint.value)} bps`
                            : focusedPoint.value.toFixed(1)}
                        </span>
                        <span
                          class="block text-[9px] font-medium sm:mt-0.5 sm:text-xs {deltaFromBaseline >= 0
                            ? 'text-positive'
                            : 'text-negative'}"
                        >
                          {deltaFromBaseline >= 0 ? '+' : ''}{activeSeries.unit === 'bps'
                            ? `${Math.round(deltaFromBaseline)} bps`
                            : deltaFromBaseline.toFixed(1)} ({focusedPoint.period})
                        </span>
                      </div>
                    </div>

                    <div
                      class="mb-1 flex flex-wrap gap-2.5 border-b border-line sm:mb-2.5 sm:gap-4"
                      role="tablist"
                      aria-label="Illustrative regime series"
                    >
                      {#each heroChartSeries as series (series.id)}
                        {@const active = activeSeriesId === series.id}
                        <button
                          type="button"
                          role="tab"
                          class="relative py-0.5 text-[9px] font-medium transition-colors duration-150 ease-out after:absolute after:inset-x-0 after:-bottom-px after:h-[1.5px] after:bg-brand hover:text-ink sm:py-[5px] sm:text-xs {active
                            ? 'text-ink after:opacity-100'
                            : 'text-ink-muted after:opacity-0'}"
                          aria-selected={active}
                          onclick={() => selectSeries(series.id)}
                        >
                          {series.label}
                        </button>
                      {/each}
                    </div>

                    <svg
                      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                      class="block h-[84px] w-full touch-pan-y sm:h-auto"
                      style:transform={`translate3d(0, ${innerChartY.toFixed(2)}px, 0)`}
                      role="img"
                      aria-label={`${activeSeries.label} illustrative 12-month sample trajectory`}
                      onpointermove={handleChartPointerMove}
                      onpointerleave={handleChartPointerLeave}
                    >
                      {#each yTicks as tick (tick.label)}
                        <line
                          x1={PAD_LEFT}
                          x2={SVG_WIDTH - PAD_RIGHT}
                          y1={tick.y}
                          y2={tick.y}
                          class="stroke-chart-grid"
                          stroke-width="1"
                        />
                        <text
                          x={PAD_LEFT - 8}
                          y={tick.y + 3.5}
                          text-anchor="end"
                          class="fill-chart-axis font-mono text-[10px] tabular-nums"
                        >
                          {tick.label}
                        </text>
                      {/each}

                      <path d={areaPath} class="fill-chart-series-1 opacity-[0.08]" />
                      <path
                        d={baselinePath}
                        fill="none"
                        class="stroke-chart-series-3 opacity-65"
                        stroke-width="1.25"
                        stroke-dasharray="3 3"
                      />
                      <path
                        d={primaryLinePath}
                        fill="none"
                        class="stroke-chart-series-1"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />

                      <line
                        x1={focusedPoint.x}
                        x2={focusedPoint.x}
                        y1={PAD_TOP}
                        y2={PAD_TOP + PLOT_H}
                        class="stroke-line-strong"
                        stroke-width="1"
                        stroke-dasharray="2 2"
                      />
                      <circle
                        cx={focusedPoint.x}
                        cy={focusedPoint.y}
                        r="4"
                        class="fill-brand stroke-surface"
                        stroke-width="2"
                      />

                      {#each plottedPoints as pt, i (pt.period)}
                        {#if i === 0 || i === 3 || i === 6 || i === 9 || i === plottedPoints.length - 1}
                          <text
                            x={pt.x}
                            y={SVG_HEIGHT - 8}
                            text-anchor={i === 0 ? 'start' : i === plottedPoints.length - 1 ? 'end' : 'middle'}
                            class="fill-chart-axis font-mono text-[10px]"
                          >
                            {pt.period}
                          </text>
                        {/if}
                      {/each}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Iconic MacBook Pro Aluminum Base Lip & Thumb Scoop -->
          <div class="relative z-2 flex w-full flex-col items-center" aria-hidden="true">
            <div class="mx-auto h-1 w-[88%] bg-[linear-gradient(90deg,#1b1e25_0%,#090b0f_15%,#090b0f_85%,#1b1e25_100%)]"></div>
            <div class="relative flex h-[9px] w-full justify-center rounded-t-[3px] border-t border-white/80 bg-[linear-gradient(90deg,#aeb6c2_0%,#e2e6ed_7%,#d6dbe4_50%,#e2e6ed_93%,#aeb6c2_100%)] dark:border-white/22 dark:bg-[linear-gradient(90deg,#272c36_0%,#424956_8%,#363c48_50%,#424956_92%,#272c36_100%)] sm:h-[15px]">
              <div class="h-[3.5px] w-[62px] rounded-b-[6px] bg-[linear-gradient(180deg,#98a1af_0%,#bcc3cf_100%)] shadow-[inset_0_1px_2px_rgba(15,23,42,0.22)] dark:bg-[linear-gradient(180deg,#1d2129_0%,#2c313d_100%)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.65)] sm:h-[6px] sm:w-[108px]"></div>
            </div>
            <div class="mx-auto h-1 w-[99%] rounded-b-[14px] bg-[linear-gradient(180deg,#8e97a6_0%,#646d7d_100%)] dark:bg-[linear-gradient(180deg,#21252e_0%,#12151b_100%)] sm:h-[7px]"></div>
          </div>
          <div
            class="pointer-events-none -mt-1 h-[18px] w-[90%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.22)_0%,rgba(15,23,42,0.08)_52%,transparent_76%)] blur-[4px] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.25)_52%,transparent_76%)]"
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </div>
  </div>
</section>
