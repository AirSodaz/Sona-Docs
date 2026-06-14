export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: string | null): value is Theme {
  return value === 'dark' || value === 'light' || value === 'system';
}
