import { createApi } from 'lib/api';
import { GlobalSettings } from 'lib/api/types';
import { getLocale, getTranslations } from 'next-intl/server';
import ActiveContainer from './container';
import { ProductCard } from './product-card';
import { SectionTitle } from './section-title';

// Skeleton component for loading state
function ProductsCarouselSkeleton() {
  return (
    <div className="w-full space-y-6" dir="ltr">
      {/* Title Section */}
      <ActiveContainer className="!py-0">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </ActiveContainer>

      {/* Carousel Section */}
      <div className="overflow-x-auto pb-6 pt-1">
        <ul className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <li
              key={i}
              className="relative aspect-[5/4] w-2/3 min-w-[200px] max-w-[475px] flex-none md:w-1/3"
            >
              <div className="h-full w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function ProductsCarousel({ settings }: { settings: GlobalSettings }) {
  const t = await getTranslations('Products');
  const language = await getLocale();

  const api = createApi({ language });
  const productsResult = await api.getProducts({
    recomended: '1',
    per_page: '15'
  });
  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.

  if (productsResult.isErr() || productsResult.value.data.products.data.length == 0) {
    return null;
  }

  const products = productsResult.value.data.products.data;
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full space-y-6" dir="ltr">
      {/* Title Section */}
      <ActiveContainer className="!py-0">
        <SectionTitle title={t('bestSelling')} />
      </ActiveContainer>

      {/* Carousel Section */}
      <div className="overflow-x-auto pb-6 pt-1">
        <ul className="flex animate-carousel gap-4">
          {carouselProducts.map((product, i) => (
            <li
              key={`${product.slug}${i}`}
              className="relative aspect-[5/4] w-2/3 min-w-[200px] max-w-[475px] flex-none md:w-1/3"
            >
              <ProductCard
                product={product}
                className="h-full w-full"
                currency={settings.site_global_currency}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Export the skeleton for use in Suspense
export { ProductsCarouselSkeleton };
