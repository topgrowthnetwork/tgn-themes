import SearchPage from '@theme/pages/search';
import { createApi } from 'lib/api';
import { getProductParams } from 'lib/utils';
import { setRequestLocale } from 'next-intl/server';

export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function Page({
  searchParams,
  params
}: {
  params: Promise<{ language: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { language } = await params;

  setRequestLocale(language);

  const { q: searchValue, sort } = searchParams as { [key: string]: string };
  const productParams = getProductParams(sort, searchValue);

  const api = createApi({ language: 'en' });
  const [productsResult, settingsResult] = await Promise.all([
    api.getProducts(productParams),
    api.getGlobalSettings()
  ]);
  if (productsResult.isErr() || settingsResult.isErr()) {
    throw new Error('Failed to get products or settings');
  }
  const products = productsResult.value.data.products.data;
  const settings = settingsResult.value.data;

  return <SearchPage products={products} searchValue={searchValue} settings={settings} />;
}
