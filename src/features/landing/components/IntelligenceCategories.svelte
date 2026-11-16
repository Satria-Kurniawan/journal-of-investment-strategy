<script lang="ts">
  import { INTELLIGENCE_CATEGORIES } from '../data/landingData';

  let activeIndex = $state<string | null>(null);
</script>

<section id="insights" class="border-b border-line bg-surface py-12 md:py-16 lg:py-20">
  <div class="mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8">
    <div class="mb-8 grid grid-cols-1 items-end gap-4 md:mb-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-10">
      <div>
        <p class="text-xs font-medium tracking-[0.1em] text-ink-muted uppercase">Intelligence Coverage</p>
        <h2 class="mt-3 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.2] font-semibold tracking-[-0.025em] text-ink">
          Six interconnected lenses across global capital.
        </h2>
      </div>
      <p class="text-[15px] leading-[1.65] text-ink-secondary">
        Rather than isolating markets into disconnected apps, JISOO organizes analytical
        workflows across six complementary domains.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-12">
      {#each INTELLIGENCE_CATEGORIES as category (category.index)}
        {@const highlighted = activeIndex === category.index}
        <article
          class="border-t py-6 transition-colors duration-200 ease-out {highlighted
            ? 'border-brand'
            : 'border-line'}"
          onmouseenter={() => (activeIndex = category.index)}
          onmouseleave={() => (activeIndex = null)}
        >
          <div class="mb-3 flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center sm:gap-3">
            <span
              class="font-mono text-xs font-medium transition-colors duration-150 ease-out {highlighted
                ? 'text-brand'
                : 'text-ink-muted'}"
            >
              {category.index}
            </span>
            <span class="text-xs text-ink-muted">{category.focusAreas}</span>
          </div>
          <h3 class="mb-2 text-lg font-semibold tracking-[-0.015em] text-ink">{category.title}</h3>
          <p class="text-sm leading-[1.6] text-ink-secondary">{category.summary}</p>
        </article>
      {/each}
    </div>
  </div>
</section>
