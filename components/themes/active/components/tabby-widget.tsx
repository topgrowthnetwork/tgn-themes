'use client';

import Script from 'next/script';
import { useEffect, useId, useRef } from 'react';

const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY || '';
const tabbyMerchantCode = process.env.NEXT_PUBLIC_TABBY_MERCHANT_CODE || '';
const isTabbyEnabled = !!tabbyPublicKey && !!tabbyMerchantCode;

type TabbyWidgetScriptProps = {
  language?: string;
};

export function TabbyWidgetScript({ language = 'en' }: TabbyWidgetScriptProps) {
  if (!isTabbyEnabled) return null;

  return <Script src="https://checkout.tabby.ai/tabby-promo.js" strategy="afterInteractive" />;
}

type TabbyPromoWidgetProps = {
  price: number | string;
  currency?: string;
  source?: 'product' | 'cart';
  language?: string;
  className?: string;
};

export function TabbyPromoWidget({
  price,
  currency = 'SAR',
  source = 'product',
  language = 'en',
  className
}: TabbyPromoWidgetProps) {
  // Generate a unique ID for this widget instance
  const reactId = useId();
  const containerId = `tabby-promo-${reactId.replace(/:/g, '')}`;
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!isTabbyEnabled) return;

    // Wait for the TabbyPromo script to load
    const initTabby = () => {
      if (typeof (window as any).TabbyPromo === 'undefined') {
        // Script not loaded yet, retry after a short delay
        setTimeout(initTabby, 100);
        return;
      }

      // Format price to 2 decimal places for SAR
      const formattedPrice = Number(price).toFixed(2);

      // Clean up previous instance content if exists
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }

      // Create new TabbyPromo instance using CSS selector
      try {
        instanceRef.current = new (window as any).TabbyPromo({
          selector: `#${containerId}`,
          currency: currency.toUpperCase(),
          price: formattedPrice,
          lang: language === 'ar' ? 'ar' : 'en',
          source: source,
          publicKey: tabbyPublicKey,
          merchantCode: tabbyMerchantCode
        });
      } catch (error) {
        console.error('Failed to initialize TabbyPromo:', error);
      }
    };

    initTabby();

    // Cleanup on unmount
    return () => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
      instanceRef.current = null;
    };
  }, [price, currency, source, language, containerId]);

  if (!isTabbyEnabled) return null;

  return <div id={containerId} className={className} />;
}
