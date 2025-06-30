import { GridTileImage } from '@theme/components/grid/tile';
import { Gallery } from '@theme/components/product/gallery';
import { ProductDescription } from '@theme/components/product/product-description';
import { createApi } from 'lib/api';
import { GlobalSettings, Product, ProductVariant } from 'lib/api/types';
import { Link } from 'lib/i18n/navigation';
import { getFullPath } from 'lib/utils';
import { Suspense } from 'react';

interface ProductPageProps {
  product: Product;
  images: Array<{ path: string; title: string }>;
  attributes: any;
  combinations: any[];
  settings: GlobalSettings;
  selectedVariant: ProductVariant | null;
}

export default function ProductPage({
  product,
  images,
  attributes,
  combinations,
  settings,
  selectedVariant
}: ProductPageProps) {
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: getFullPath(product.thumbnail?.path || ''),
    offers: {
      '@type': 'AggregateOffer',
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceCurrency: settings.site_global_currency,
      highPrice: product.price,
      lowPrice: product.price
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-theme border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:sticky lg:top-8 lg:basis-4/6 lg:self-start">
            <Gallery
              images={images.map((image) => ({
                src: getFullPath(image.path),
                altText: image.title
              }))}
              selectedVariant={selectedVariant}
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription
              product={product}
              attributes={attributes}
              currency={settings.site_global_currency}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
        <Suspense>
          <RelatedProducts product={product} currency={settings.site_global_currency} />
        </Suspense>
      </div>
    </>
  );
}

async function RelatedProducts({ product, currency }: { product: Product; currency: string }) {
  const api = createApi({ language: 'en' });
  const relatedProductsResult = await api.getProducts({
    category_id: product.category_id.toString(),
    order_by: 'selling_count'
  });
  if (relatedProductsResult.isErr()) {
    return null;
  }

  const relatedProducts = relatedProductsResult.value.data.products.data;
  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="scrollbar-hide flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((relatedProduct: Product) => (
          <li
            key={relatedProduct.slug}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link className="relative h-full w-full" href={`/product/${relatedProduct.slug}`}>
              <GridTileImage
                alt={relatedProduct.title}
                label={{
                  title: relatedProduct.title,
                  amount: relatedProduct.price.toString(),
                  currencyCode: currency
                }}
                src={getFullPath(relatedProduct.thumbnail?.path || '')}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
