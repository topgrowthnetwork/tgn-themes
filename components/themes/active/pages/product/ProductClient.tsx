'use client';

import { Gallery } from '@theme/components/product/gallery';
import { ProductDescription } from '@theme/components/product/product-description';
import { GlobalSettings, Product } from 'lib/api/types';
import { getFullPath, getSelectedVariantFromUrlParams } from 'lib/utils';
import { useSearchParams } from 'next/navigation';

export default function ProductClient({
  product,
  images,
  attributes,
  settings
}: {
  product: Product;
  images: Array<{ path: string; title: string }>;
  attributes: any;
  settings: GlobalSettings;
}) {
  const searchParams = useSearchParams();

  const selectedVariant = getSelectedVariantFromUrlParams(product, searchParams);

  return (
    <div className="flex flex-col rounded-theme border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
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
  );
}
