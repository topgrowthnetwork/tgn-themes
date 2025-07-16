import { createApi } from 'lib/api';
import { GlobalSettings } from 'lib/api/types';
import { getLocale, getTranslations } from 'next-intl/server';
import Container from './container';
import { FakeScrollbar } from './fake-scrollbar';
import { ProductCard } from './product-card';
import { SectionTitle } from './section-title';

// Skeleton component for loading state
function ProductsCarouselSkeleton() {
  return (
    <div className="w-full space-y-6" dir="ltr">
      {/* Title Section */}
      <Container className="!py-0">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </Container>

      {/* Carousel Section */}
      <div className="overflow-x-auto pb-6 pt-1">
        <Container className="overflow-visible !py-0">
          <ul className="-mr-4 flex gap-4 sm:-mr-6 lg:-mr-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="relative aspect-[5/4] w-2/3 min-w-[200px] max-w-[475px] flex-none md:w-1/3"
                style={{
                  marginRight: i === 5 ? '100vw' : undefined
                }}
              >
                <div className="h-full w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* Fake Scrollbar Skeleton */}
      <Container className="!py-0">
        <div className="mt-2 h-3 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      </Container>
    </div>
  );
}

export async function ProductsCarousel({ settings }: { settings: GlobalSettings }) {
  const t = await getTranslations('Products');
  const language = await getLocale();

  const api = createApi({ language });
  const productsResult = await api.getProducts({
    order: 'best_selling',
    per_page: '8'
  });

  if (productsResult.isErr()) {
    return null;
  }

  const products = productsResult.value.data.products.data;

  return (
    <div className="w-full space-y-6" dir="ltr">
      {/* Title Section */}
      <Container className="!pb-0">
        <SectionTitle title={t('bestSelling')} />
      </Container>

      {/* Scrollable Section - extends beyond container */}
      <div
        id="products-carousel-scroll"
        className="scrollbar-hide relative overflow-x-auto pb-6 pt-1"
      >
        <Container className="overflow-visible !py-0">
          <ul className="-mr-4 flex gap-4 sm:-mr-6 lg:-mr-8">
            {products.map((product, index) => (
              <li
                key={product.slug}
                className="relative aspect-[5/4] w-2/3 min-w-[200px] max-w-[475px] flex-none md:w-1/3"
                style={{
                  marginRight: index === products.length - 1 ? '100vw' : undefined
                }}
              >
                <ProductCard
                  product={product}
                  className="h-full w-full"
                  currency={settings.site_global_currency}
                />
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* Fake Scrollbar inside Container */}
      <Container className="!pt-0">
        <FakeScrollbar targetSelector="#products-carousel-scroll" className="mt-2" />
      </Container>
    </div>
  );
}

// Export the skeleton for use in Suspense
export { ProductsCarouselSkeleton };
