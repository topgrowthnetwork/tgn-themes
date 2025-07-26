import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CategoryPage from '@theme/pages/category';
import { createApi } from 'lib/api';
import { getProductParams } from 'lib/utils';
import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ language: string; categoryId: string }>;
}): Promise<Metadata> {
  const { language, categoryId } = await params;

  setRequestLocale(language);

  const api = createApi({ language });
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

  const { sort, page = '1' } = searchParams as { [key: string]: string };

  const api = createApi({ language });
  const productParams = getProductParams(sort, undefined, categoryId);

  const [productsResult, settingsResult, categoryResult] = await Promise.all([
    api.getProducts({ ...productParams, page, per_page: '12' }),
    api.getGlobalSettings(),
    api.getCategories({ category_id: categoryId })
  ]);
  if (productsResult.isErr() || settingsResult.isErr() || categoryResult.isErr()) {
    throw new Error('Failed to get products or settings or category');
  }
  const settings = settingsResult.value.data;
  const category = categoryResult.value.data.category;
  const subcategories = categoryResult.value.data.categories;

  return (
    <CategoryPage
      productsResult={productsResult.value.data}
      settings={settings}
      category={category}
      subcategories={subcategories}
    />
  );
}
