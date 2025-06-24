import Navbar from 'components/layout/navbar';
import { createApi } from 'lib/api';
import { getFullPath } from 'lib/utils';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';
  const api = createApi({ language: 'en' });
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <Navbar />
        <Suspense>
          <main>{children}</main>
        </Suspense>
      </body>
    </html>
  );
}
