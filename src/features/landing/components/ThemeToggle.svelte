<script lang="ts">
  import Moon from '@lucide/svelte/icons/moon';
  import Sun from '@lucide/svelte/icons/sun';
  import { themeState } from '../theme/themeState.svelte';

  const isDark = $derived(themeState.mode === 'dark');
  const label = $derived(isDark ? 'Switch to light mode' : 'Switch to dark mode');
</script>

<button
  type="button"
  class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-ink-secondary transition-[background-color,border-color,color,transform] duration-150 ease-out hover:border-line-strong hover:bg-elevated hover:text-ink active:scale-[0.96]"
  onclick={() => themeState.toggle()}
  aria-label={label}
  aria-pressed={isDark}
  title={label}
>
  {#if isDark}
    <Sun size={16} strokeWidth={1.75} aria-hidden="true" />
  {:else}
    <Moon size={16} strokeWidth={1.75} aria-hidden="true" />
  {/if}
</button>
