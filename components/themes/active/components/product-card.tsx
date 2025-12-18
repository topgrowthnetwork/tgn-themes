'use client';

import { useMediaQuery } from '@uidotdev/usehooks';
import clsx from 'clsx';
import { GlobalSettings, Product, ProductAttributes } from 'lib/api/types';
import { Link } from 'lib/i18n/navigation';
import { buildProductUrlWithCheapestVariant, getCheapestVariant, getFullPath } from 'lib/utils';
import { useState } from 'react';
import { GridTileImage } from './grid/tile';
import { ProductQuickViewModal } from './product/quick-view-modal';

// Check if quick view modal is enabled
const ENABLE_QUICK_VIEW = process.env.NEXT_PUBLIC_PRODUCT_MODAL === 'true';

interface ProductCardProps {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
  currency?: string;
  isInteractive?: boolean;
  // Optional: pass these for quick view modal
  settings?: GlobalSettings;
  productImages?: Array<{ path: string; title: string }>;
  productAttributes?: ProductAttributes;
}

export function ProductCard({
  product,
  className = '',
  sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  priority = false,
  currency,
  isInteractive = true,
  settings,
  productImages,
  productAttributes
}: ProductCardProps) {
  const currencyCode = currency || 'EGP';
  const cheapestVariant = getCheapestVariant(product);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Gets the display price for the product
  const getDisplayPrice = () => {
    return cheapestVariant ? cheapestVariant.final_price : product.final_price;
  };

  // Gets the original price for the product
  const getOriginalPrice = () => {
    return cheapestVariant ? cheapestVariant.price : product.price;
  };

  // Generate images for quick view from product data if not provided
  const images =
    productImages ||
    (product.thumbnail
      ? [{ path: product.thumbnail.path, title: product.thumbnail.title || product.title }]
      : []);

  // Generate attributes for quick view from product variants if not provided
  const attributes: ProductAttributes =
    productAttributes ||
    (() => {
      // Build attributes from product variants
      const attrs: ProductAttributes = {};
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          variant.attribute_values.forEach((av) => {
            const attrName = av.attribute.name;
            if (!attrs[attrName]) {
              attrs[attrName] = [];
            }
            // Check if value already exists
            if (!attrs[attrName].some((v) => v.value === av.value)) {
              attrs[attrName].push({ value: av.value, hex: av.hex || undefined });
            }
          });
        });
      }
      return attrs;
    })();

  const tileImage = (
    <GridTileImage
      alt={product.title}
      isInteractive={isInteractive}
      label={{
        title: product.title,
        amount: getDisplayPrice().toString(),
        currencyCode: currencyCode,
        originalAmount: getOriginalPrice().toString()
      }}
      src={getFullPath(product.thumbnail?.path)}
      fill
      sizes={sizes}
      priority={priority}
    />
  );

  // If quick view is enabled and we have settings, check screen size
  if (ENABLE_QUICK_VIEW && settings) {
    // On desktop: show modal, on mobile: navigate to product page
    if (isDesktop) {
      return (
        <>
          <button
            type="button"
            onClick={() => setIsQuickViewOpen(true)}
            className={clsx('group block w-full text-left', className)}
            data-testid="product-card-link"
          >
            {tileImage}
          </button>
          <ProductQuickViewModal
            product={product}
            images={images}
            attributes={attributes}
            settings={settings}
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
          />
        </>
      );
    }
    // On mobile: navigate to product page
    return (
      <Link
        href={buildProductUrlWithCheapestVariant(product)}
        className={clsx('group block', className)}
        data-testid="product-card-link"
      >
        {tileImage}
      </Link>
    );
  }

  // Default: render as link to product page
  return (
    <Link
      href={buildProductUrlWithCheapestVariant(product)}
      className={clsx('group block', className)}
      data-testid="product-card-link"
    >
      {tileImage}
    </Link>
  );
}
