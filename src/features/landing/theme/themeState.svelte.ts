export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'jisoo:theme';

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  } catch {
    return 'light';
  }
}

function applyThemeToDom(mode: ThemeMode, enableTransition = false): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (enableTransition) {
    root.dataset.themeReady = 'true';
  }
  root.dataset.theme = mode;
  root.style.colorScheme = mode;

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', mode === 'dark' ? '#0B0E14' : '#F8FAFC');
  }
}

class ThemeStore {
  mode = $state<ThemeMode>(readInitialTheme());

  init(): void {
    applyThemeToDom(this.mode, false);
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        document.documentElement.dataset.themeReady = 'true';
      });
    }
  }

  set(nextMode: ThemeMode): void {
    this.mode = nextMode;
    applyThemeToDom(nextMode, true);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, nextMode);
      } catch {
        // Ignore storage write errors in restricted browsing contexts
      }
    }
  }

  toggle(): void {
    this.set(this.mode === 'light' ? 'dark' : 'light');
  }
}

export const themeState = new ThemeStore();
