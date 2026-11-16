<script lang="ts">
  import { INTELLIGENCE_CATEGORIES, NAV_ITEMS } from '../data/landingData';
</script>

<footer class="bg-background py-12 pb-8 sm:py-16 sm:pb-10">
  <div class="mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 border-b border-line pb-12 sm:grid-cols-2 min-[901px]:grid-cols-[minmax(0,1.5fr)_minmax(0,0.75fr)_minmax(0,0.9fr)] min-[901px]:gap-12">
      <div class="sm:col-span-2 min-[901px]:col-span-1">
        <a
          href="#overview"
          class="inline-flex items-center gap-2 text-[15px] font-semibold tracking-[0.14em] text-ink"
        >
          <span class="h-1.5 w-1.5 rounded-[1px] bg-brand" aria-hidden="true"></span>
          <span>JISOO</span>
        </a>
        <p class="mt-2 text-[13px] font-medium text-ink-secondary">
          Journal of Investment Strategy &amp; Outlook
        </p>
        <p class="mt-3 max-w-[44ch] text-[13px] leading-[1.6] text-ink-muted">
          An independent financial intelligence platform uniting market monitoring, macroeconomic
          research, digital asset analysis, and investment strategy.
        </p>
      </div>

      <div>
        <h3 class="mb-4 text-xs font-semibold tracking-[0.06em] text-ink-muted uppercase">Navigation</h3>
        <ul class="flex flex-col gap-2">
          {#each NAV_ITEMS as item (item.id)}
            <li>
              <a
                href={item.href}
                class="text-sm text-ink-secondary transition-colors duration-150 ease-out hover:text-ink hover:underline hover:underline-offset-[3px]"
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <div>
        <h3 class="mb-4 text-xs font-semibold tracking-[0.06em] text-ink-muted uppercase">
          Research Categories
        </h3>
        <ul class="flex flex-col gap-2">
          {#each INTELLIGENCE_CATEGORIES as category (category.index)}
            <li>
              <a
                href="#insights"
                class="text-sm text-ink-secondary transition-colors duration-150 ease-out hover:text-ink hover:underline hover:underline-offset-[3px]"
              >
                {category.title}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <div class="flex flex-col gap-2 pt-6">
      <p class="text-xs font-medium text-ink-secondary">
        &copy; 2026 JISOO &mdash; Journal of Investment Strategy &amp; Outlook.
      </p>
      <p class="max-w-[92ch] text-xs leading-[1.55] text-ink-muted">
        Financial Information Disclaimer: JISOO provides informational and educational content only and
        does not constitute personalized investment, financial, legal, or tax advice. Sample market
        figures and editorial briefs shown on this Phase 1 landing page are illustrative.
      </p>
    </div>
  </div>
</footer>
