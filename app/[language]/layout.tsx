import GuestTokenProvider from '@shared/components/guest-token-provider';
import NProgressProvider from '@shared/components/nprogress-provider';
import { TamaraWidgetScript } from '@theme/components/tamara-widget';
import ThemeContent from '@theme/layout';
import { ThemeSwitcher, ToastContainerWrapper } from 'components/shared/components';
import CartProviderWrapper from 'lib/context/cart-provider-wrapper';
import { ShippingProvider } from 'lib/context/shipping-context';
import { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode, Suspense } from 'react';
import { routing } from '../../lib/i18n/routing';
import '../globals.css';

// Dynamic metadata is handled client-side now
export const metadata: Metadata = {
    title: {
    default: 'Loading...',
    template: '%s'
  }
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ language: string }>;
}) {
  // Ensure that the incoming `language` is valid
  const { language } = await params;
  if (!hasLocale(routing.locales, language)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(language);

  // Check if the language is RTL
  const isRTL = language === 'ar';

  // Get current theme from environment variable
  const theme = process.env.NEXT_PUBLIC_THEME || 'active';
  const themeVariant = process.env.NEXT_PUBLIC_THEME_VARIANT || '';

  // Get Meta Pixel ID from environment variable
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html
      lang={language}
      dir={isRTL ? 'rtl' : 'ltr'}
      data-theme={theme}
      data-theme-variant={themeVariant}
    >
      <head>
        {/* Meta Pixel Code */}
        {metaPixelId && (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${metaPixelId}');
                  fbq('track', 'PageView');
                `
              }}
            />
            {/* Meta Pixel Noscript */}
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        <TamaraWidgetScript language={language} country="SA" />
        {/* Dynamic metadata will be set by client component */}
        <DynamicMetadata />
      </head>
      <body
        className={`bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white ${
          isRTL ? 'rtl' : 'ltr'
        }`}
      >
        <GuestTokenProvider>
          <NProgressProvider>
            <NuqsAdapter>
              <NextIntlClientProvider>
                <ShippingProvider>
                  <CartProviderWrapper>
                    <ThemeContent>
                      <Suspense>
                        <main>{children}</main>
                      </Suspense>
                    </ThemeContent>
                    <ToastContainerWrapper />
                    <ThemeSwitcher />
                  </CartProviderWrapper>
                </ShippingProvider>
              </NextIntlClientProvider>
            </NuqsAdapter>
          </NProgressProvider>
        </GuestTokenProvider>
      </body>
    </html>
  );
}

// Client component for dynamic metadata
function DynamicMetadata() {
  return <DynamicMetadataClient />;
}

import { DynamicMetadataClient } from './dynamic-metadata';

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ language: locale }));
}
