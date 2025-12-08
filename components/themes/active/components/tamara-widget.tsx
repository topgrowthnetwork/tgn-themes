'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const tamaraPublicKey = process.env.NEXT_PUBLIC_TAMARA_PUBLIC_KEY || '';
const isTamaraEnabled = process.env.NEXT_PUBLIC_CLIENT === 'arkan' && !!tamaraPublicKey;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tamara-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        amount?: number | string;
        'inline-type'?: number | string;
        type?: string;
      };
    }
  }
}

type TamaraWidgetScriptProps = {
  country?: string;
  language?: string;
};

export function TamaraWidgetScript({
  country = 'SA',
  language = 'en'
}: TamaraWidgetScriptProps) {
  if (!isTamaraEnabled) return null;

  useEffect(() => {
    (window as any).tamaraWidgetConfig = {
      lang: language,
      country,
      publicKey: tamaraPublicKey
    };
  }, [country, language]);

  return (
    <>
      <Script id="tamara-config" strategy="beforeInteractive">
        {`
          window.tamaraWidgetConfig = {
            lang: '${language}',
            country: '${country}',
            publicKey: '${tamaraPublicKey}'
          };
        `}
      </Script>
      <Script src="https://cdn.tamara.co/widget-v2/tamara-widget.js" strategy="afterInteractive" />
    </>
  );
}

type TamaraSummaryWidgetProps = {
  amount: number | string;
  inlineType?: number;
  className?: string;
};

export function TamaraSummaryWidget({
  amount,
  inlineType = 4,
  className
}: TamaraSummaryWidgetProps) {
  if (!isTamaraEnabled) return null;

  return (
    <tamara-widget
      className={className}
      type="tamara-summary"
      inline-type={inlineType}
      amount={amount}
    />
  );
}

