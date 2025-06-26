import { isValidThemeName, ThemeConfig } from './config';
import { themes } from './themes';

const DEFAULT_THEME = 'active';

export function getCurrentTheme(): ThemeConfig {
  const themeName = process.env.NEXT_PUBLIC_THEME || DEFAULT_THEME;

  if (!isValidThemeName(themeName)) {
    console.warn(`Invalid theme name: ${themeName}. Falling back to ${DEFAULT_THEME}`);
    return themes[DEFAULT_THEME]!;
  }

  return themes[themeName]!;
}

export function getThemeColors(): Record<string, string> {
  const theme = getCurrentTheme();
  return theme.colors;
}

export function getThemeFonts(): { en: string; ar: string } {
  const theme = getCurrentTheme();
  return theme.fonts;
}

export function getThemeBorderRadius(): string {
  const theme = getCurrentTheme();
  return theme.borderRadius;
}
