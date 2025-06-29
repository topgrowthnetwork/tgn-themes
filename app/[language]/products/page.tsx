import ProductsPage from '@theme/pages/products';
import { createApi } from 'lib/api';
import { getProductParams } from 'lib/utils';
import { setRequestLocale } from 'next-intl/server';

export const runtime = 'edge';

export const metadata = {
  title: 'Products',
  description: 'Browse all products in the store.'
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

  const { category, sort, page = '1' } = searchParams as { [key: string]: string };
  const productParams = getProductParams(sort, undefined, category);

  const api = createApi({ language });
  const [productsResult, categoriesResult, settingsResult] = await Promise.all([
    api.getProducts({ ...productParams, page, per_page: '12' }),
    api.getCategories(),
    api.getGlobalSettings()
  ]);

  if (productsResult.isErr() || categoriesResult.isErr() || settingsResult.isErr()) {
    throw new Error('Failed to get products, categories, or settings');
  }

  const settings = settingsResult.value.data;
  const categories = categoriesResult.value.data.categories;

  return (
    <ProductsPage
      productsResult={productsResult.value.data}
      categories={categories}
      settings={settings}
      selectedCategory={category}
    />
  );
}
