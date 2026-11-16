<script lang="ts">
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { FEATURED_RESEARCH, type ResearchBrief } from '../data/landingData';

  interface Props {
    onOpenBrief: (brief: ResearchBrief, trigger: HTMLButtonElement) => void;
  }

  let { onOpenBrief }: Props = $props();

  function handleReadClick(brief: ResearchBrief, event: MouseEvent): void {
    onOpenBrief(brief, event.currentTarget as HTMLButtonElement);
  }
</script>

<section id="research" class="border-b border-line py-12 md:py-16 lg:py-20">
  <div class="mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8">
    <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-medium tracking-[0.1em] text-ink-muted uppercase">Featured Research</p>
        <h2 class="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.025em] text-ink">
          Selected Analytical Briefs
        </h2>
      </div>
      <p class="font-mono text-[11px] tracking-[0.06em] text-ink-muted">
        ILLUSTRATIVE SAMPLE BRIEFS · NOT INVESTMENT ADVICE OR CITED REPORTS
      </p>
    </div>

    <div class="border-t border-line">
      {#each FEATURED_RESEARCH as brief (brief.id)}
        <article class="grid grid-cols-1 items-start gap-3 border-b border-line py-6 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10 md:py-8">
          <div class="flex flex-row flex-wrap items-center gap-3 pt-1 md:flex-col md:items-start md:gap-1">
            <span class="text-xs font-semibold tracking-[0.02em] text-brand">{brief.category}</span>
            <span class="text-xs text-ink-muted">{brief.dateLabel}</span>
            <span class="text-xs text-ink-muted tabular-nums">{brief.readingTime}</span>
          </div>

          <div>
            <h3 class="mb-3 font-serif text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.25] font-medium tracking-[-0.015em] text-ink">
              {brief.title}
            </h3>
            <p class="mb-4 max-w-[66ch] text-[15px] leading-[1.65] text-ink-secondary">
              {brief.summary}
            </p>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-ink transition-[color,transform] duration-150 ease-out hover:text-brand active:scale-[0.975]"
              onclick={(event) => handleReadClick(brief, event)}
            >
              <span>Read illustrative brief</span>
              <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
