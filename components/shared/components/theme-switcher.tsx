'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeVariant {
  id: string;
  name: string;
  color: string;
}

const THEME_VARIANTS: Record<string, ThemeVariant[]> = {
  active: [
    { id: '', name: 'Default', color: '#3b82f6' },
    { id: 'velvet', name: 'Velvet', color: '#ec4899' },
    { id: 'emerald', name: 'Emerald', color: '#10b981' }
  ],
  minimal: [{ id: '', name: 'Default', color: '#64748b' }],
  classic: [{ id: '', name: 'Default', color: '#ef4444' }]
};

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('');
  const [currentVariant, setCurrentVariant] = useState('');

  // Only show in preview mode
  const isPreviewMode = process.env.NEXT_PUBLIC_MODE === 'preview';

  useEffect(() => {
    if (!isPreviewMode) return;

    // Get current theme and variant from HTML data attributes
    const html = document.documentElement;
    const theme = html.getAttribute('data-theme') || '';
    const variant = html.getAttribute('data-theme-variant') || '';

    setCurrentTheme(theme);
    setCurrentVariant(variant);

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+V to toggle theme switcher
      if (event.ctrlKey && event.shiftKey && event.key === 'V') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // Escape to close
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode]);

  const handleVariantChange = (variantId: string) => {
    const html = document.documentElement;
    html.setAttribute('data-theme-variant', `${currentTheme}.${variantId}`);
    setCurrentVariant(variantId);
  };

  if (!isPreviewMode || !isOpen) return null;

  const availableVariants = THEME_VARIANTS[currentTheme] || [];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="w-64 rounded-theme bg-white p-4 shadow-xl dark:bg-gray-800">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Theme Variants</h3>
            <div className="text-xs text-gray-500 dark:text-gray-400">Ctrl+Shift+V</div>
          </div>

          <div className="space-y-1">
            {availableVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant.id)}
                className={clsx(
                  'flex w-full items-center justify-between rounded-md p-2 text-left transition-colors',
                  {
                    'dark:bg-primary-900/20 border border-primary-200 bg-primary-50 dark:border-primary-700':
                      currentVariant === variant.id,
                    'hover:bg-gray-50 dark:hover:bg-gray-700': currentVariant !== variant.id
                  }
                )}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: variant.color }}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {variant.name}
                  </span>
                </div>
                {currentVariant === variant.id && <Check className="h-4 w-4 text-primary-600" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
