import HomePage from '@theme/pages/home';
import { createApi } from 'lib/api';
import { setRequestLocale } from 'next-intl/server';

export default async function Page({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  // Fetch sliders data
  const api = createApi({ language });
  const [slidersResult, categoriesResult, productsResult, settingsResult, bannersResult] =
    await Promise.all([
      api.getSliders(),
      api.getCategories(),
      api.getProducts({ sort: 'selling_count', per_page: '3', recomended: '1' }),
      api.getGlobalSettings(),
      api.getBanners()
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

  const bannersRaw = bannersResult.isOk() ? bannersResult.value.data.banners : [];
  const banners = [...bannersRaw]
    .filter((b) => b.is_active === 1 && b.img)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .slice(0, 3);

  return (
    <HomePage
      sliders={sliders}
      categories={categories}
      products={products}
      settings={settings}
      banners={banners}
    />
  );
}
