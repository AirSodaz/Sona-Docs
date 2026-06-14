import { THEME_STORAGE_KEY } from '@/lib/theme';

export const THEME_INIT_SCRIPT = `
(function() {
  var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  var root = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function getStoredTheme() {
    try {
      var value = window.localStorage.getItem(storageKey);
      return value === 'dark' || value === 'light' || value === 'system'
        ? value
        : 'system';
    } catch (_) {
      return 'system';
    }
  }

  var theme = getStoredTheme();
  var resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  root.classList.toggle('dark', resolvedTheme === 'dark');
  root.style.colorScheme = resolvedTheme;
})();
`;
