'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useState } from 'react';

// Environment variables
const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY || '';
const tabbyMerchantCode = process.env.NEXT_PUBLIC_TABBY_MERCHANT_CODE || '';
const tamaraPublicKey = process.env.NEXT_PUBLIC_TAMARA_PUBLIC_KEY || '';

const isTabbyEnabled = !!tabbyPublicKey && !!tabbyMerchantCode;
const isTamaraEnabled = process.env.NEXT_PUBLIC_CLIENT === 'arkan' && !!tamaraPublicKey;

// Declare the tamara-widget custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tamara-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        amount?: number | string;
        'inline-type'?: number | string;
        type?: string;
      };
    }
  }
}

type SplitPaymentWidgetProps = {
  price: number | string;
  currency?: string;
  className?: string;
};

export function SplitPaymentWidget({
  price,
  currency = 'SAR',
  className
}: SplitPaymentWidgetProps) {
  const locale = useLocale();
  const t = useTranslations('SplitPayment');
  const isArabic = locale === 'ar';
  const [popupUrl, setPopupUrl] = useState<string | null>(null);

  const numericPrice = Number(price);

  const openTabbyPopup = useCallback(() => {
    const formattedPrice = numericPrice.toFixed(2);
    const lang = isArabic ? 'ar' : 'en';
    const url = `https://checkout.tabby.ai/promos/product-page/installments/${lang}/?price=${formattedPrice}&currency=${currency.toUpperCase()}&merchant_code=${tabbyMerchantCode}&public_key=${tabbyPublicKey}`;
    setPopupUrl(url);
  }, [numericPrice, currency, isArabic]);

  const closePopup = useCallback(() => {
    setPopupUrl(null);
  }, []);

  // Don't render if neither provider is enabled
  if (!isTabbyEnabled && !isTamaraEnabled) return null;

  return (
    <>
      <div
        className={`rounded-xl border border-neutral-200 bg-transparent p-3 dark:border-neutral-700 ${className || ''}`}
      >
        {/* Header with merged text */}
        <div className="mb-2 flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <span>
            {t('splitInto')} {t('shariaCompliant')}
          </span>
        </div>

        {/* Provider logos */}
        <div className="flex items-center gap-2">
          {isTabbyEnabled && (
            <button
              onClick={openTabbyPopup}
              className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              aria-label="Learn more about Tabby"
            >
              <Image
                src="/image/gateways/favicons/tabby.png"
                alt="Tabby"
                width={60}
                height={24}
                className="h-5 w-auto object-contain"
              />
            </button>
          )}

          {isTamaraEnabled && (
            <div className="relative">
              {/* Visual button */}
              <div className="flex cursor-pointer items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700">
                <Image
                  src="/image/gateways/favicons/tamara.png"
                  alt="Tamara"
                  width={80}
                  height={24}
                  className="h-5 w-auto object-contain"
                />
              </div>
              {/* Invisible clickable Tamara widget overlay */}
              <div className="absolute inset-0 overflow-hidden opacity-0">
                <tamara-widget type="tamara-summary" inline-type={2} amount={numericPrice} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal - Only used for Tabby */}
      {popupUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closePopup}
        >
          <div
            className="relative h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute end-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-black transition-colors hover:bg-black/20"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Iframe */}
            <iframe src={popupUrl} className="h-full w-full border-0" title="Payment Options" />
          </div>
        </div>
      )}
    </>
  );
}

