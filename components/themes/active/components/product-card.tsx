'use client';

import clsx from 'clsx';
import { GlobalSettings, Product, ProductAttributes } from 'lib/api/types';
import { Link } from 'lib/i18n/navigation';
import { buildProductUrlWithCheapestVariant, getCheapestVariant, getFullPath } from 'lib/utils';
import { ShoppingCart } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
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
  const [quickViewProductId, setQuickViewProductId] = useQueryState(
    'quickView',
    parseAsString.withOptions({ history: 'push' })
  );

  const isQuickViewOpen = quickViewProductId === product.id.toString();

  const handleOpenQuickView = () => {
    setQuickViewProductId(product.id.toString(), { shallow: false });
  };

  const handleCloseQuickView = () => {
    setQuickViewProductId(null, { shallow: false });
  };

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

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleOpenQuickView();
  };

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

  // Quick view cart button
  const quickViewButton = ENABLE_QUICK_VIEW && settings && (
    <button
      type="button"
      onClick={handleQuickViewClick}
      className="absolute end-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition-all hover:scale-110 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
      aria-label="Quick view"
    >
      <ShoppingCart className="h-5 w-5" strokeWidth={2} />
    </button>
  );

  return (
    <>
      <div className={clsx('group relative block', className)}>
        <Link
          href={buildProductUrlWithCheapestVariant(product)}
          className="block h-full w-full"
          data-testid="product-card-link"
        >
          {tileImage}
        </Link>
        {quickViewButton}
      </div>

      {ENABLE_QUICK_VIEW && settings && (
        <ProductQuickViewModal
          product={product}
          images={images}
          attributes={attributes}
          settings={settings}
          isOpen={isQuickViewOpen}
          onClose={handleCloseQuickView}
        />
      )}
    </>
  );
}
