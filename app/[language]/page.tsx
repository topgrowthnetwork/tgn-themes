import HomePage from '@theme/pages/home';
import { createApi } from 'lib/api';
import { setRequestLocale } from 'next-intl/server';

export default async function Page({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  // Fetch sliders data
  const api = createApi({ language });
  const [slidersResult, categoriesResult, productsResult, settingsResult] = await Promise.all([
    api.getSliders(),
    api.getCategories(),
    api.getProducts({ order_by: 'selling_count', per_page: '3', recomended: '1' }),
    api.getGlobalSettings()
  ]);

  if (
    slidersResult.isErr() ||
    categoriesResult.isErr() ||
    productsResult.isErr() ||
    settingsResult.isErr()
  ) {
    return null;
  }

  const sliders = slidersResult.value.data.sliders;
  const categories = categoriesResult.value.data.categories;
  const products = productsResult.value.data.products.data;
  const settings = settingsResult.value.data;

  return (
    <HomePage sliders={sliders} categories={categories} products={products} settings={settings} />
  );
}
