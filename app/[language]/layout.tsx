import Navbar from '@theme/layout/navbar';
import { createApi } from 'lib/api';
import { getFullPath } from 'lib/utils';
import { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Inter, Noto_Sans_Arabic, Noto_Serif } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { routing } from '../../lib/i18n/routing';
import '../globals.css';

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
    icons: [{ url: getFullPath(globalSettings.site_favicon.path) }]
  };
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-sans-arabic'
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif'
});

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

  // Get font variables based on theme
  const getFontVariables = () => {
    switch (theme) {
      case 'classic':
        return `${notoSerif.variable} ${notoSansArabic.variable}`;
      case 'minimal':
      case 'active':
      default:
        return `${inter.variable} ${notoSansArabic.variable}`;
    }
  };

  return (
    <html
      lang={language}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={getFontVariables()}
      data-theme={theme}
    >
      <body
        className={`bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white ${
          isRTL ? 'rtl' : 'ltr'
        }`}
      >
        <NextIntlClientProvider>
          <Navbar />
          <Suspense>
            <main>{children}</main>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ language: locale }));
}
