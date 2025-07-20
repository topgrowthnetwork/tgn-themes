import GuestTokenProvider from '@shared/components/guest-token-provider';
import NProgressProvider from '@shared/components/nprogress-provider';
import ThemeContent from '@theme/layout';
import { ThemeSwitcher, ToastContainerWrapper } from 'components/shared/components';
import { createApi } from 'lib/api';
import { getFullPath } from 'lib/utils';
import { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode, Suspense } from 'react';
import { routing } from '../../lib/i18n/routing';
import '../globals.css';

export const revalidate = 1 * 60; // 1 minute

export async function generateMetadata({
  params
}: {
  params: Promise<{ language: string }>;
}): Promise<Metadata> {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';
  const api = createApi({ language });
  const globalSettingsResult = await api.getGlobalSettings();

  if (globalSettingsResult.isErr()) {
    throw new Error('Failed to get global settings');
  }

  const globalSettings = globalSettingsResult.value.data;
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: globalSettings.site_title || '',
      template: `%s | ${globalSettings.site_title}`
    },
    description: globalSettings.site_description || '',
    icons: [
      globalSettings.site_favicon?.path
        ? { url: getFullPath(globalSettings.site_favicon?.path) }
        : { url: '/favicon.ico' }
    ]
  };
}

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
                <ThemeContent>
                  <Suspense>
                    <main>{children}</main>
                  </Suspense>
                </ThemeContent>
                <ToastContainerWrapper />
                <ThemeSwitcher />
              </NextIntlClientProvider>
            </NuqsAdapter>
          </NProgressProvider>
        </GuestTokenProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ language: locale }));
}
