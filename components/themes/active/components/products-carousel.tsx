import { GlobalSettings, Product } from 'lib/api/types';
import { useTranslations } from 'next-intl';
import ActiveContainer from './container';
import { ProductCard } from './product-card';
import { SectionTitle } from './section-title';

export function ProductsCarousel({
  products,
  settings
}: {
  products: Product[];
  settings: GlobalSettings;
}) {
  const t = useTranslations('Products');

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
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
