export type ThemeName = 'active' | 'minimal' | 'classic';

export interface ThemeConfig {
  name: ThemeName;
  colors: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  fonts: {
    en: string;
    ar: string;
  };
  borderRadius: string;
}

export const THEME_NAMES: ThemeName[] = ['active', 'minimal', 'classic'];

export function isValidThemeName(theme: string): theme is ThemeName {
  return THEME_NAMES.includes(theme as ThemeName);
}
