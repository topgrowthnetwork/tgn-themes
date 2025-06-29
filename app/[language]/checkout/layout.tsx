import CheckoutLayout from '@shared/pages/checkout/layout';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

export const runtime = 'edge';

interface CheckoutLayoutProps {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}

export default async function Layout({ children, params }: CheckoutLayoutProps) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  return (
    <Suspense>
      <CheckoutLayout language={language}>{children}</CheckoutLayout>
    </Suspense>
  );
}
