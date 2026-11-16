<script lang="ts">
  import Menu from '@lucide/svelte/icons/menu';
  import X from '@lucide/svelte/icons/x';
  import { NAV_ITEMS } from '../data/landingData';
  import ThemeToggle from './ThemeToggle.svelte';

  interface Props {
    activeSection: string;
    isScrolled: boolean;
    onOpenPreview: () => void;
  }

  let { activeSection, isScrolled, onOpenPreview }: Props = $props();
  let mobileMenuOpen = $state(false);

  function closeMenu(): void {
    mobileMenuOpen = false;
  }

  function handleWindowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && mobileMenuOpen) {
      mobileMenuOpen = false;
    }
  }

  function handleMobileGetStarted(): void {
    mobileMenuOpen = false;
    onOpenPreview();
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<header
  class="sticky top-0 z-40 h-16 border-b bg-nav-bg backdrop-blur-md transition-[border-color,background-color] duration-200 ease-out {isScrolled
    ? 'border-line'
    : 'border-transparent'}"
>
  <div class="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">
    <a href="#overview" class="inline-flex min-w-0 items-center gap-2" onclick={closeMenu} aria-label="JISOO Home">
      <span class="h-1.5 w-1.5 shrink-0 rounded-[1px] bg-brand" aria-hidden="true"></span>
      <span class="text-[15px] font-semibold tracking-[0.14em] text-ink">JISOO</span>
      <span class="mx-1 hidden h-3.5 w-px bg-line-strong min-[1080px]:inline-block" aria-hidden="true"></span>
      <span class="hidden truncate text-xs text-ink-muted min-[1080px]:inline">
        Journal of Investment Strategy &amp; Outlook
      </span>
    </a>

    <nav class="hidden items-center md:flex" aria-label="Primary navigation">
      <ul class="flex items-center gap-4 min-[1080px]:gap-6">
        {#each NAV_ITEMS as item (item.id)}
          {@const active = activeSection === item.id}
          <li>
            <a
              href={item.href}
              class="relative inline-block py-1 text-sm font-medium transition-colors duration-150 ease-out after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[1.5px] after:origin-left after:bg-brand after:transition-transform after:duration-200 after:ease-out hover:text-ink {active
                ? 'text-ink after:scale-x-100'
                : 'text-ink-secondary after:scale-x-0'}"
              aria-current={active ? 'location' : undefined}
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="flex shrink-0 items-center gap-3">
      <ThemeToggle />
      <button
        type="button"
        class="hidden h-9 items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-brand px-4 text-[13px] font-medium leading-none text-brand-fg transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover active:scale-[0.975] md:inline-flex"
        onclick={onOpenPreview}
      >
        Get Started
      </button>
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-ink md:hidden"
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {#if mobileMenuOpen}
          <X size={18} strokeWidth={1.75} aria-hidden="true" />
        {:else}
          <Menu size={18} strokeWidth={1.75} aria-hidden="true" />
        {/if}
      </button>
    </div>
  </div>

  {#if mobileMenuOpen}
    <div
      id="mobile-navigation"
      class="fixed inset-x-0 top-16 z-39 border-b border-line bg-surface shadow-overlay animate-drawer-slide"
      role="dialog"
      aria-label="Mobile navigation"
    >
      <div class="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-5 pt-4 pb-6 sm:px-6">
        <ul class="flex flex-col">
          {#each NAV_ITEMS as item (item.id)}
            {@const active = activeSection === item.id}
            <li>
              <a
                href={item.href}
                class="flex min-h-11 items-center border-b border-line text-[15px] font-medium {active
                  ? 'text-brand'
                  : 'text-ink-secondary'}"
                onclick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
        <div class="pt-2">
          <button
            type="button"
            class="inline-flex h-11 w-full items-center justify-center rounded-md bg-brand px-4 text-sm font-medium text-brand-fg transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover active:scale-[0.975]"
            onclick={handleMobileGetStarted}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  {/if}
</header>
