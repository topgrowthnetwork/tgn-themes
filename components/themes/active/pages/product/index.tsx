'use client';

import { ProductCardSkeleton, ProductPageSkeleton } from '@shared/components/skeletons';
import { ProductCard } from '@theme/components/product-card';
import { Product } from 'lib/api/types';
import { useGlobalSettings, useProduct, useProducts } from 'lib/hooks/api';
import { getFullPath } from 'lib/utils';
import { useTranslations } from 'next-intl';
import ProductClient from './ProductClient';

interface ProductPageProps {
  handle: string;
}

export default function ProductPage({ handle }: ProductPageProps) {
  const { data: productData, isLoading: productLoading } = useProduct(handle);
  const { data: settings, isLoading: settingsLoading } = useGlobalSettings();

  const isLoading = productLoading || settingsLoading;

  if (isLoading || !productData || !settings) {
    return <ProductPageSkeleton />;
  }

  const { product, images, attributes } = productData;

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
          images={images || []}
          attributes={attributes}
          settings={settings}
        />
        <RelatedProducts product={product} currency={settings.site_global_currency} />
      </div>
    </>
  );
}

function RelatedProducts({ product, currency }: { product: Product; currency: string }) {
  const t = useTranslations('Product');

  const { data: relatedData, isLoading } = useProducts({
    category_id: product.category_id.toString(),
    sort: 'selling_count',
    per_page: '10'
  });

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="mb-4 text-2xl font-bold">{t('relatedProducts')}</h2>
        <ul className="scrollbar-hide flex w-full gap-4 overflow-x-auto pb-2 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              className="aspect-square w-[46%] flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            >
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const relatedProducts = relatedData?.products.data ?? [];
  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">{t('relatedProducts')}</h2>
      <ul className="scrollbar-hide flex w-full gap-4 overflow-x-auto pb-2 pt-1">
        {relatedProducts.map((relatedProduct: Product) => (
          <li
            key={relatedProduct.slug}
            className="aspect-square w-[48%] flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <ProductCard
              product={relatedProduct}
              currency={currency}
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 46vw"
              className="h-full w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
