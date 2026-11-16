<script lang="ts">
  import X from '@lucide/svelte/icons/x';
  import type { ResearchBrief } from '../data/landingData';

  interface Props {
    brief: ResearchBrief | null;
    onClose: () => void;
  }

  let { brief, onClose }: Props = $props();

  function handleWindowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && brief) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if brief}
  <div
    class="fixed inset-0 z-60 flex items-center justify-center bg-scrim p-4 animate-fade-in"
    role="presentation"
    onclick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <div
      class="max-h-[min(88svh,760px)] w-full max-w-[680px] overflow-y-auto rounded-lg border border-line bg-surface p-5 shadow-overlay animate-modal-enter sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brief-modal-title"
    >
      <div class="mb-3 flex items-center justify-between">
        <div class="inline-flex items-center gap-2 text-xs text-ink-muted">
          <span class="text-xs font-semibold tracking-[0.02em] text-brand">{brief.category}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{brief.readingTime}</span>
        </div>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink-secondary transition-[background-color,color] duration-150 ease-out hover:bg-elevated hover:text-ink"
          onclick={onClose}
          aria-label="Close research brief"
        >
          <X size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <p class="mb-3 font-mono text-[11px] tracking-[0.06em] text-ink-muted">
        ILLUSTRATIVE SAMPLE BRIEF · EDUCATIONAL PREVIEW ONLY
      </p>

      <h3 id="brief-modal-title" class="mb-6 border-b border-line pb-5 font-serif text-[28px] leading-[1.25] font-medium text-ink">
        {brief.title}
      </h3>

      <div class="mb-6">
        <h4 class="mb-2 text-xs font-semibold tracking-[0.06em] text-ink-muted uppercase">Core Thesis</h4>
        <p class="text-[15px] leading-[1.65] text-ink-secondary">{brief.thesis}</p>
      </div>

      <div class="mb-6 grid grid-cols-1 gap-4 border-y border-line py-5 sm:grid-cols-2 sm:gap-6">
        <div>
          <h4 class="mb-2 text-xs font-semibold tracking-[0.06em] text-positive uppercase">Bullish Scenario</h4>
          <p class="text-[15px] leading-[1.65] text-ink-secondary">{brief.bullCase}</p>
        </div>
        <div>
          <h4 class="mb-2 text-xs font-semibold tracking-[0.06em] text-negative uppercase">Bearish Scenario</h4>
          <p class="text-[15px] leading-[1.65] text-ink-secondary">{brief.bearCase}</p>
        </div>
      </div>

      <div class="mb-6">
        <h4 class="mb-2 text-xs font-semibold tracking-[0.06em] text-ink-muted uppercase">
          Key Risk &amp; Invalidation Watchpoints
        </h4>
        <ul class="flex list-disc flex-col gap-2 pl-4">
          {#each brief.keyRisks as risk (risk)}
            <li class="text-sm leading-[1.55] text-ink-secondary">{risk}</li>
          {/each}
        </ul>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <p class="max-w-[46ch] text-xs leading-normal text-ink-muted">
          Sample editorial layout demonstrating JISOO's structured research format. Full archive search
          and local bookmarking arrive in Phase 2.
        </p>
        <button
          type="button"
          class="inline-flex h-10 items-center justify-center rounded-md border border-line-strong bg-surface px-4 text-sm font-medium text-ink transition-[background-color,border-color,transform] duration-150 ease-out hover:border-ink-muted hover:bg-elevated active:scale-[0.975]"
          onclick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
