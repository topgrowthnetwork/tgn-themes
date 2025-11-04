import { ProductCard } from '@theme/components/product-card';
import { createApi } from 'lib/api';
import { GlobalSettings, Product, ProductVariant } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Suspense } from 'react';
import ProductClient from './ProductClient';

interface ProductPageProps {
  product: Product;
  images: Array<{ path: string; title: string }>;
  attributes: any;
  combinations: any[];
  settings: GlobalSettings;
  selectedVariant?: ProductVariant | null;
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
      lowPrice: product.final_price
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
        <ProductClient
          product={product}
          images={images}
          attributes={attributes}
          settings={settings}
        />
        <Suspense>
          <RelatedProducts product={product} currency={settings.site_global_currency} />
        </Suspense>
      </div>
    </>
  );
}

async function RelatedProducts({ product, currency }: { product: Product; currency: string }) {
  const locale = await getLocale();
  const api = createApi({ language: locale });
  const relatedProductsResult = await api.getProducts({
    category_id: product.category_id.toString(),
    sort: 'selling_count'
  });
  if (relatedProductsResult.isErr()) {
    return null;
  }

  const relatedProducts = relatedProductsResult.value.data.products.data;
  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <RelatedProductsTitle />
      <ul className="scrollbar-hide flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((relatedProduct: Product) => (
          <li
            key={relatedProduct.slug}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <ProductCard
              product={relatedProduct}
              currency={currency}
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              className="h-full w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatedProductsTitle() {
  const t = useTranslations('Product');

  return <h2 className="mb-4 text-2xl font-bold">{t('relatedProducts')}</h2>;
}
