<script lang="ts">
  import { WHY_JISOO_ITEMS } from '../data/landingData';
</script>

<section class="border-b border-line py-12 md:py-16 lg:py-20">
  <div class="mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8">
    <div class="mb-10 max-w-[620px]">
      <p class="text-xs font-medium tracking-[0.1em] text-ink-muted uppercase">Why JISOO</p>
      <h2 class="mt-3 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.2] font-semibold tracking-[-0.025em] text-ink">
        Designed for clarity where conventional market tools overwhelm.
      </h2>
    </div>

    <ul class="border-t border-line">
      {#each WHY_JISOO_ITEMS as item (item.index)}
        <li class="grid grid-cols-1 items-baseline gap-2 border-b border-line py-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
          <h3 class="text-base font-semibold text-ink">{item.title}</h3>
          <p class="text-sm leading-[1.6] text-ink-secondary">{item.detail}</p>
        </li>
      {/each}
    </ul>
  </div>
</section>
