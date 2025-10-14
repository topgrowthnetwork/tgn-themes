import SearchPage from '@theme/pages/search';
import { createApi } from 'lib/api';
import { getProductParams } from 'lib/utils';
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

  const t = await getTranslations({ locale: language, namespace: 'Metadata.search' });

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function Page({
  searchParams,
  params
}: {
  params: Promise<{ language: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { language } = await params;

  setRequestLocale(language);

  const { q: searchValue, sort, page = '1' } = searchParams as { [key: string]: string };
  const productParams = getProductParams(sort, searchValue);

  const api = createApi({ language });
  const [productsResult, settingsResult] = await Promise.all([
    api.getProducts({ ...productParams, page, per_page: '12' }),
    api.getGlobalSettings()
  ]);
  if (productsResult.isErr() || settingsResult.isErr()) {
    throw new Error('Failed to get products or settings');
  }
  const settings = settingsResult.value.data;

  return (
    <SearchPage
      productsResult={productsResult.value.data}
      searchValue={searchValue}
      settings={settings}
    />
  );
}
