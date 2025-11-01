import ArkanReturnPolicyPolicy from '@theme/pages/return-exchange';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ language: string }>;
}): Promise<Metadata> {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  const t = await getTranslations({ locale: language, namespace: 'Metadata.returnAndExchange' });

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function Page({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  return <ArkanReturnPolicyPolicy />;
}
