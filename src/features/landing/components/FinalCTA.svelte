<script lang="ts">
  import ArrowRight from '@lucide/svelte/icons/arrow-right';

  interface Props {
    onExplore: () => void;
  }

  let { onExplore }: Props = $props();
</script>

<section class="border-b border-line bg-surface py-12 md:py-20">
  <div class="mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-end justify-between gap-6 border-l-2 border-brand pl-4 md:gap-8 md:pl-6">
      <div class="max-w-[620px]">
        <p class="text-xs font-medium tracking-[0.1em] text-ink-muted uppercase">
          JISOO · Journal of Investment Strategy &amp; Outlook
        </p>
        <h2 class="mt-3 mb-4 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.14] font-semibold tracking-[-0.025em] text-ink">
          See the Bigger Picture.<br />
          Think Beyond the Market.
        </h2>
        <p class="text-base leading-[1.6] text-ink-secondary">
          Build a deeper understanding of the forces shaping global financial markets.
        </p>
      </div>

      <div class="flex w-full flex-wrap items-center gap-3 sm:w-auto">
        <button
          type="button"
          class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-transparent bg-brand px-4 text-sm font-medium whitespace-nowrap text-brand-fg transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover active:scale-[0.975] sm:w-auto"
          onclick={onExplore}
        >
          <span>Explore JISOO</span>
          <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <a
          href="#research"
          class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-line-strong bg-surface px-4 text-sm font-medium whitespace-nowrap text-ink transition-[background-color,border-color,transform] duration-150 ease-out hover:border-ink-muted hover:bg-elevated active:scale-[0.975] sm:w-auto"
        >
          Read Featured Briefs
        </a>
      </div>
    </div>
  </div>
</section>
