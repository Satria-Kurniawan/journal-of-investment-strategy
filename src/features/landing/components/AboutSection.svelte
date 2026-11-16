<script lang="ts">
  import { ABOUT_PILLARS } from '../data/landingData';
</script>

<section id="about" class="border-b border-line py-12 md:py-16 lg:py-20">
  <div class="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-start gap-10 px-5 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-8">
    <div class="lg:sticky lg:top-24">
      <p class="text-xs font-medium tracking-[0.1em] text-ink-muted uppercase">About JISOO</p>
      <h2 class="mt-3 mb-5 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.2] font-semibold tracking-[-0.025em] text-ink">
        Built for disciplined thinking in noisy markets.
      </h2>
      <p class="mb-4 font-serif text-[1.1875rem] leading-[1.6] text-ink">
        Financial information is abundant, yet coherent synthesis remains rare. JISOO brings
        market structure, macroeconomic analysis, digital asset research, and capital strategy
        together in a quiet workspace designed for deliberate judgment.
      </p>
      <p class="text-sm leading-[1.6] text-ink-muted">
        No algorithmic feed noise, no promotional bias—only structured research and transparent
        quantitative framing.
      </p>
    </div>

    <div>
      <ol class="border-t border-line">
        {#each ABOUT_PILLARS as pillar (pillar.index)}
          <li class="grid grid-cols-[32px_minmax(0,1fr)] items-baseline gap-3 border-b border-line py-5 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-4 sm:py-6">
            <span class="font-mono text-xs font-medium text-brand">{pillar.index}</span>
            <div>
              <h3 class="mb-1 text-base font-semibold text-ink">{pillar.title}</h3>
              <p class="text-sm leading-[1.6] text-ink-secondary">{pillar.description}</p>
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</section>
