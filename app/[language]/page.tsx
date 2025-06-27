import HomePage from '@theme/pages/home';
import { setRequestLocale } from 'next-intl/server';

export const runtime = 'edge';

export default async function Page({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  return <HomePage />;
}
