<script lang="ts">
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { onMount } from 'svelte';
  import newsFeed from '../data/cointelegraphNews.json';

  interface CointelegraphItem {
    id: string;
    title: string;
    url: string;
    source: string;
    author: string;
    category: string;
    publishedAt: string;
    summary: string;
    thumbnail: string;
    isTopStory?: boolean;
  }

  interface CointelegraphPayload {
    fetchedAt: string;
    topStory: CointelegraphItem | null;
    items: CointelegraphItem[];
  }

  let showAll = $state(false);
  let brokenImages = $state<Record<string, boolean>>({});
  let topStory = $state<CointelegraphItem | null>(newsFeed.topStory as CointelegraphItem | null);
  let items = $state<CointelegraphItem[]>(newsFeed.items as CointelegraphItem[]);
  let fetchedAt = $state<string>(newsFeed.fetchedAt);
  let isLiveSynced = $state(false);

  const visibleItems = $derived(showAll ? items : items.slice(0, 5));

  onMount(() => {
    const controller = new AbortController();

    fetch('/api/cointelegraph', {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as Partial<CointelegraphPayload>;
        if (Array.isArray(data.items) && data.items.length > 0) {
          topStory = data.topStory ?? topStory;
          items = data.items;
          if (data.fetchedAt) fetchedAt = data.fetchedAt;
          isLiveSynced = true;
        }
      })
      .catch(() => {
        // Silently retain bundled snapshot fallback if offline or static preview
      });

    return () => controller.abort();
  });

  function formatDate(raw: string): string {
    if (!raw) return 'Latest';
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return raw;
    return (
      new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      }).format(parsed) + ' UTC'
    );
  }

  const syncedLabel = $derived.by(() => {
    const parsed = new Date(fetchedAt);
    if (Number.isNaN(parsed.getTime())) return 'Snapshot';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(parsed);
  });

  function markBroken(id: string): void {
    brokenImages = { ...brokenImages, [id]: true };
  }
</script>

<section id="news" class="border-b border-line bg-surface py-12 md:py-16 lg:py-20">
  <div class="mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8">
    <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-medium tracking-[0.1em] text-ink-muted uppercase">
          News Intelligence
        </p>
        <h2 class="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.025em] text-ink">
          Top Crypto News &amp; Market Feed
        </h2>
      </div>
      <span class="font-mono text-[11px] tracking-[0.06em] text-ink-muted">
        SOURCE: COINTELEGRAPH · {isLiveSynced ? 'LIVE · ' : ''}SYNCED {syncedLabel.toUpperCase()}
      </span>
    </div>

    <!-- Featured "Top crypto news today" Spotlight -->
    {#if topStory}
      <a
        href={topStory.url}
        target="_blank"
        rel="noopener noreferrer"
        class="group mb-10 grid grid-cols-1 items-center gap-6 border-y border-line py-7 transition-colors duration-150 ease-out md:grid-cols-[minmax(0,440px)_minmax(0,1fr)] md:gap-10"
      >
        {#if topStory.thumbnail && !brokenImages[topStory.id]}
          <div class="aspect-5/3 w-full overflow-hidden rounded-lg border border-line bg-muted">
            <img
              src={topStory.thumbnail}
              alt={topStory.title}
              loading="lazy"
              decoding="async"
              onerror={() => topStory && markBroken(topStory.id)}
              class="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
          </div>
        {/if}

        <div class="min-w-0">
          <div class="mb-3 flex flex-wrap items-center gap-2.5 text-xs">
            <span class="font-semibold tracking-[0.02em] text-brand">Top Crypto News Today</span>
            <span class="text-ink-muted" aria-hidden="true">&middot;</span>
            <span class="font-mono text-[11px] text-ink-muted tabular-nums">
              {formatDate(topStory.publishedAt)}
            </span>
          </div>

          <h3 class="mb-3 font-serif text-[clamp(1.5rem,2.3vw,2rem)] leading-[1.2] font-medium tracking-[-0.015em] text-ink transition-colors duration-150 ease-out group-hover:text-brand">
            {topStory.title}
          </h3>

          <p class="mb-4 max-w-[60ch] text-[15px] leading-[1.65] text-ink-secondary">
            {topStory.summary}
          </p>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span class="text-xs text-ink-muted">
              By {topStory.author} &middot; {topStory.source}
            </span>
            <span class="inline-flex items-center gap-1 text-xs font-medium text-ink transition-colors duration-150 ease-out group-hover:text-brand">
              <span>Read on Cointelegraph</span>
              <ArrowUpRight
                size={14}
                strokeWidth={1.75}
                class="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </a>
    {/if}

    <!-- Latest Headlines with Thumbnails -->
    <div>
      {#each visibleItems as item (item.id)}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          class="group grid grid-cols-1 items-center gap-4 border-b border-line py-5 transition-colors duration-150 ease-out hover:bg-background/60 sm:grid-cols-[136px_minmax(0,1fr)_auto] sm:gap-6 sm:px-2"
        >
          {#if item.thumbnail && !brokenImages[item.id]}
            <div class="aspect-5/3 w-full overflow-hidden rounded-md border border-line bg-muted sm:w-[136px]">
              <img
                src={item.thumbnail}
                alt={item.title}
                loading="lazy"
                decoding="async"
                onerror={() => markBroken(item.id)}
                class="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />
            </div>
          {:else}
            <div class="hidden aspect-5/3 w-[136px] rounded-md border border-line bg-muted sm:block"></div>
          {/if}

          <div class="min-w-0">
            <div class="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
              <span class="font-semibold text-brand">{item.source}</span>
              <span class="text-ink-muted" aria-hidden="true">&middot;</span>
              <span class="font-mono text-[11px] text-ink-muted tabular-nums">
                {formatDate(item.publishedAt)}
              </span>
              <span class="text-ink-muted" aria-hidden="true">&middot;</span>
              <span class="text-ink-muted">By {item.author}</span>
            </div>

            <h3 class="mb-1 text-base leading-snug font-semibold text-ink transition-colors duration-150 ease-out group-hover:text-brand">
              {item.title}
            </h3>

            <p class="line-clamp-2 max-w-[68ch] text-sm leading-[1.55] text-ink-secondary">
              {item.summary}
            </p>
          </div>

          <div class="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap text-ink-muted transition-colors duration-150 ease-out group-hover:text-brand">
            <span>Read</span>
            <ArrowUpRight
              size={14}
              strokeWidth={1.75}
              class="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </div>
        </a>
      {/each}
    </div>

    <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p class="text-xs text-ink-muted">
        Headlines, cover thumbnails, and brief excerpts link directly to original reporting on
        <a
          href="https://cointelegraph.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-ink-secondary underline underline-offset-2 hover:text-brand"
        >
          cointelegraph.com
        </a>.
      </p>

      {#if items.length > 5}
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-md border border-line-strong bg-background px-3.5 text-xs font-medium text-ink transition-[background-color,border-color,transform] duration-150 ease-out hover:border-ink-muted hover:bg-elevated active:scale-[0.975]"
          onclick={() => (showAll = !showAll)}
        >
          {showAll ? 'Show fewer' : `Show all ${items.length} articles`}
        </button>
      {/if}
    </div>
  </div>
</section>
