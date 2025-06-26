import { ThemeConfig } from './config';

export const themes: Record<string, ThemeConfig> = {
  active: {
    name: 'active',
    colors: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    fonts: {
      en: 'Inter, system-ui, sans-serif',
      ar: 'Noto Sans Arabic, system-ui, sans-serif'
    },
    borderRadius: '0.75rem' // 12px
  },
  minimal: {
    name: 'minimal',
    colors: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    fonts: {
      en: 'Inter, system-ui, sans-serif',
      ar: 'Noto Sans Arabic, system-ui, sans-serif'
    },
    borderRadius: '0.375rem' // 6px
  },
  classic: {
    name: 'classic',
    colors: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    fonts: {
      en: 'Georgia, serif',
      ar: 'Noto Serif Arabic, serif'
    },
    borderRadius: '0.125rem' // 2px
  }
};
