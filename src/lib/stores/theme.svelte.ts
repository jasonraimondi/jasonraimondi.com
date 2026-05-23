import { browser } from "$app/environment";

const STORAGE_KEY = "theme-preference";

export type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (!browser) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
  if (!browser) return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

function applyTheme(theme: Theme): void {
  if (!browser) return;
  document.documentElement.setAttribute("data-theme", theme);
}

function createThemeStore() {
  let theme = $state<Theme>("light");
  let isUserSet = $state(false);

  function initialize() {
    const stored = getStoredTheme();
    if (stored) {
      theme = stored;
      isUserSet = true;
    } else {
      theme = getSystemTheme();
      isUserSet = false;
    }
    applyTheme(theme);

    // Listen for OS theme changes (only apply if user hasn't set preference)
    if (browser) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        if (!isUserSet) {
          theme = e.matches ? "dark" : "light";
          applyTheme(theme);
        }
      });
    }
  }

  function toggle() {
    theme = theme === "light" ? "dark" : "light";
    isUserSet = true;
    applyTheme(theme);
    if (browser) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }

  function reset() {
    theme = getSystemTheme();
    isUserSet = false;
    applyTheme(theme);
    if (browser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    get current() {
      return theme;
    },
    get isUserSet() {
      return isUserSet;
    },
    initialize,
    toggle,
    reset,
  };
}

export const themeStore = createThemeStore();
