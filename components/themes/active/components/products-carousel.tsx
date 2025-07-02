import { GlobalSettings, Product } from 'lib/api/types';
import { Link } from 'lib/i18n/navigation';
import { getFullPath } from 'lib/utils';
import { useTranslations } from 'next-intl';
import ActiveContainer from './container';
import { GridTileImage } from './grid/tile';
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
    <div className="w-full space-y-6">
      {/* Title Section */}
      <ActiveContainer className="!py-0">
        <SectionTitle title={t('bestSelling')} />
      </ActiveContainer>

      {/* Carousel Section */}
      <div className="overflow-x-auto pb-6 pt-1">
        <ul dir="ltr" className="flex animate-carousel gap-4">
          {carouselProducts.map((product, i) => (
            <li
              key={`${product.slug}${i}`}
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
            >
              <Link href={`/product/${product.slug}`} className="relative h-full w-full">
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.final_price.toString(),
                    currencyCode: settings.site_global_currency
                  }}
                  src={getFullPath(product.thumbnail?.path)}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
