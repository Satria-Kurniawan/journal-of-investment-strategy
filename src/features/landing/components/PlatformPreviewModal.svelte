<script lang="ts">
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import X from '@lucide/svelte/icons/x';

  interface Props {
    open: boolean;
    onClose: () => void;
  }

  let { open, onClose }: Props = $props();

  function handleWindowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && open) {
      onClose();
    }
  }

  function jumpToSection(hash: string): void {
    onClose();
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-60 flex items-center justify-center bg-scrim p-4 animate-fade-in"
    role="presentation"
    onclick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <div
      class="w-full max-w-[520px] rounded-lg border border-line bg-surface p-6 shadow-overlay animate-modal-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-dialog-title"
    >
      <div class="mb-3 flex items-center justify-between">
        <p class="text-xs font-medium tracking-[0.1em] text-ink-muted uppercase">
          Phase 1 · Public Editorial Release
        </p>
        <button
          type="button"
          class="inline-flex h-8.5 w-8.5 items-center justify-center rounded-md border border-line text-ink-secondary transition-[background-color,color] duration-150 ease-out hover:bg-elevated hover:text-ink"
          onclick={onClose}
          aria-label="Close platform preview"
        >
          <X size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <h3 id="preview-dialog-title" class="mb-3 text-xl font-semibold tracking-[-0.02em] text-ink">
        JISOO — Journal of Investment Strategy &amp; Outlook
      </h3>
      <p class="mb-6 text-sm leading-[1.6] text-ink-secondary">
        You are viewing the Phase 1 public landing release. Interactive workspace modules—including
        live market adapters, the Compounding Calculator, Macroeconomic Intelligence, and the local
        Investment Journal—are scheduled across upcoming development phases.
      </p>

      <div class="mb-6 border-t border-line">
        <button
          type="button"
          class="flex w-full items-center justify-between border-b border-line py-3 text-left text-sm font-medium text-ink transition-colors duration-150 ease-out hover:text-brand"
          onclick={() => jumpToSection('#markets')}
        >
          <span>Inspect Illustrative Market Benchmarks</span>
          <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button
          type="button"
          class="flex w-full items-center justify-between border-b border-line py-3 text-left text-sm font-medium text-ink transition-colors duration-150 ease-out hover:text-brand"
          onclick={() => jumpToSection('#insights')}
        >
          <span>Browse Six Intelligence Disciplines</span>
          <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button
          type="button"
          class="flex w-full items-center justify-between border-b border-line py-3 text-left text-sm font-medium text-ink transition-colors duration-150 ease-out hover:text-brand"
          onclick={() => jumpToSection('#research')}
        >
          <span>Read Sample Analytical Briefs</span>
          <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <div class="flex justify-end">
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
