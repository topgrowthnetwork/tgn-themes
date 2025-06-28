import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CategoryPage from '@theme/pages/category';
import { createApi } from 'lib/api';
import { getProductParams } from 'lib/utils';
import { setRequestLocale } from 'next-intl/server';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: Promise<{ language: string; categoryId: string }>;
}): Promise<Metadata> {
  const { language, categoryId } = await params;

  setRequestLocale(language);

  const api = createApi({ language: 'en' });
  const categoryResult = await api.getCategories({ categoryId });
  if (categoryResult.isErr()) {
    throw new Error('Failed to get category');
  }
  const category = categoryResult.value.data.categories[0];

  if (!category) return notFound();

  return {
    title: category.name,
    description: `${category.name} products`
  };
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ language: string; categoryId: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { language, categoryId } = await params;

  setRequestLocale(language);

  const { sort } = searchParams as { [key: string]: string };

  const api = createApi({ language: 'en' });
  const productParams = getProductParams(sort, undefined, categoryId);

  const [productsResult, settingsResult] = await Promise.all([
    api.getProducts(productParams),
    api.getGlobalSettings()
  ]);
  if (productsResult.isErr() || settingsResult.isErr()) {
    throw new Error('Failed to get products or settings');
  }
  const products = productsResult.value.data.products.data;
  const settings = settingsResult.value.data;

  return <CategoryPage products={products} settings={settings} />;
}
