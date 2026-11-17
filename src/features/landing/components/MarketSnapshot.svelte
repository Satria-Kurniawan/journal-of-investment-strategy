<script lang="ts">
  import { onMount } from 'svelte';
  import { MARKET_SNAPSHOT_DATA, type MarketSnapshotAsset } from '../data/landingData';

  type FilterOption = 'All' | MarketSnapshotAsset['assetClass'];

  interface MarketPatch {
    id: string;
    priceFormatted: string;
    changePct: number;
    direction: 'up' | 'down';
    contextLabel: string;
  }

  interface MarketsApiPayload {
    fetchedAt: string;
    sources: string[];
    items: MarketPatch[];
  }

  let selectedFilter = $state<FilterOption>('All');
  let assets = $state<MarketSnapshotAsset[]>(MARKET_SNAPSHOT_DATA);
  let isLive = $state(false);
  let fetchedAt = $state<string | null>(null);
  let sources = $state<string[]>([]);

  const filterTabs: { value: FilterOption; label: string }[] = [
    { value: 'All', label: 'All' },
    { value: 'Digital Asset', label: 'Digital' },
    { value: 'Equity Index', label: 'Equities' },
    { value: 'Commodity', label: 'Commodities' },
    { value: 'FX Index', label: 'FX' }
  ];

  const visibleAssets = $derived(
    selectedFilter === 'All'
      ? assets
      : assets.filter((asset) => asset.assetClass === selectedFilter)
  );

  const liveTimestamp = $derived.by(() => {
    if (!fetchedAt) return '';
    const parsed = new Date(fetchedAt);
    if (Number.isNaN(parsed.getTime())) return '';
    return (
      new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      }).format(parsed) + ' UTC'
    );
  });

  onMount(() => {
    const controller = new AbortController();

    fetch('/api/markets', {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as Partial<MarketsApiPayload>;
        if (!Array.isArray(data.items) || data.items.length === 0) return;

        const patchMap = new Map(data.items.map((item) => [item.id, item]));
        assets = MARKET_SNAPSHOT_DATA.map((base) => {
          const patch = patchMap.get(base.id);
          return patch ? { ...base, ...patch } : base;
        });
        isLive = true;
        fetchedAt = data.fetchedAt ?? null;
        sources = Array.isArray(data.sources) ? data.sources : [];
      })
      .catch(() => {
        // Silently keep illustrative fallback snapshot when offline or static preview
      });

    return () => controller.abort();
  });
</script>

<section id="markets" class="border-b border-line py-12 md:py-16">
  <div class="mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p class="text-xs font-medium tracking-[0.1em] text-ink-muted uppercase">Market Snapshot</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink">
          Selected Global Benchmarks
        </h2>
      </div>
      <div class="flex flex-col items-start gap-3 min-[901px]:items-end">
        <p class="font-mono text-[11px] tracking-[0.06em] text-ink-muted">
          {#if isLive}
            LIVE MARKET SNAPSHOT · UPDATED {liveTimestamp.toUpperCase()}
          {:else}
            ILLUSTRATIVE SAMPLE DATA · PHASE 1 PREVIEW
          {/if}
        </p>
        <div class="flex flex-wrap gap-3 sm:gap-4" role="tablist" aria-label="Filter market benchmarks by asset class">
          {#each filterTabs as tab (tab.value)}
            {@const active = selectedFilter === tab.value}
            <button
              type="button"
              role="tab"
              class="relative py-1 text-xs font-medium transition-colors duration-150 ease-out after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[1.5px] after:bg-brand hover:text-ink sm:text-[13px] {active
                ? 'text-ink after:opacity-100'
                : 'text-ink-muted after:opacity-0'}"
              aria-selected={active}
              onclick={() => (selectedFilter = tab.value)}
            >
              {tab.label}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-lg border border-line bg-surface">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr>
            <th scope="col" class="border-b border-line bg-muted px-4 py-3 text-xs font-medium whitespace-nowrap text-ink-muted sm:px-5">
              Asset
            </th>
            <th scope="col" class="hidden border-b border-line bg-muted px-5 py-3 text-xs font-medium whitespace-nowrap text-ink-muted sm:table-cell">
              Symbol
            </th>
            <th scope="col" class="hidden border-b border-line bg-muted px-5 py-3 text-xs font-medium whitespace-nowrap text-ink-muted sm:table-cell">
              Classification
            </th>
            <th scope="col" class="border-b border-line bg-muted px-4 py-3 text-right text-xs font-medium whitespace-nowrap text-ink-muted sm:px-5">
              Reference Price
            </th>
            <th scope="col" class="border-b border-line bg-muted px-4 py-3 text-right text-xs font-medium whitespace-nowrap text-ink-muted sm:px-5">
              24h Movement
            </th>
            <th scope="col" class="hidden border-b border-line bg-muted px-5 py-3 text-xs font-medium whitespace-nowrap text-ink-muted min-[901px]:table-cell">
              Context
            </th>
          </tr>
        </thead>
        <tbody>
          {#each visibleAssets as asset (asset.id)}
            <tr class="group transition-colors duration-150 ease-out hover:bg-elevated">
              <td class="border-b border-line px-4 py-3 align-middle text-sm group-last:border-b-0 sm:px-5 sm:py-4">
                <span class="block font-medium text-ink">{asset.name}</span>
                <span class="mt-0.5 block text-xs text-ink-muted sm:hidden">
                  {asset.symbol} &middot; {asset.assetClass}
                </span>
              </td>
              <td class="hidden border-b border-line px-5 py-4 align-middle font-mono text-[13px] font-medium text-ink-secondary group-last:border-b-0 sm:table-cell">
                {asset.symbol}
              </td>
              <td class="hidden border-b border-line px-5 py-4 align-middle text-[13px] text-ink-secondary group-last:border-b-0 sm:table-cell">
                {asset.assetClass}
              </td>
              <td class="border-b border-line px-4 py-3 text-right align-middle text-sm font-medium text-ink tabular-nums group-last:border-b-0 sm:px-5 sm:py-4">
                {asset.priceFormatted}
              </td>
              <td class="border-b border-line px-4 py-3 text-right align-middle text-sm tabular-nums group-last:border-b-0 sm:px-5 sm:py-4">
                <span
                  class="inline-block rounded-sm px-2 py-0.5 text-[13px] font-medium {asset.direction === 'up'
                    ? 'bg-positive-subtle text-positive'
                    : 'bg-negative-subtle text-negative'}"
                >
                  {asset.direction === 'up' ? '+' : ''}{asset.changePct.toFixed(2)}%
                </span>
              </td>
              <td class="hidden border-b border-line px-5 py-4 align-middle text-[13px] text-ink-secondary group-last:border-b-0 min-[901px]:table-cell">
                {asset.contextLabel}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <p class="mt-4 max-w-[78ch] text-xs leading-normal text-ink-muted">
      {#if isLive}
        Live benchmark quotes sourced via {sources.join(' & ') || 'external market feeds'} through
        <code class="font-mono">/api/markets</code> (cached at edge). Prices are informational only.
      {:else}
        Benchmarks above use structured placeholder figures to demonstrate cross-asset coverage. Live market
        quotes load automatically when connected to <code class="font-mono">/api/markets</code>.
      {/if}
    </p>
  </div>
</section>
