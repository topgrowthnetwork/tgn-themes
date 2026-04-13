import type { ReactNode } from 'react';

/** Normalize API / env currency strings for comparisons and fallback display. */
export function normalizeCurrencyCode(currencyCode: string): string {
  return currencyCode.trim().toUpperCase();
}

type CurrencyRenderer = () => ReactNode;

/**
 * Custom symbol renderers for specific ISO codes. Add entries here as needed.
 * SAR uses the [Saudi Riyal Font](https://github.com/emran-alhaddad/Saudi-Riyal-Font) (Unicode U+20C1).
 */
const CURRENCY_SYMBOL_RENDERERS: Partial<Record<string, CurrencyRenderer>> = {
  SAR: () => (
    <span
      className="icon-saudi_riyal_new inline-block align-[-0.06em] text-lg"
      aria-label="SAR"
      role="img"
    />
  )
};

/**
 * React node to show beside formatted amounts: custom symbols when defined, otherwise the ISO code.
 */
export function getCurrencySymbolDisplay(currencyCode: string): ReactNode {
  const code = normalizeCurrencyCode(currencyCode);
  const render = CURRENCY_SYMBOL_RENDERERS[code];
  if (render) {
    return render();
  }
  return code;
}
