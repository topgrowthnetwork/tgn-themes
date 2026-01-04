'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { GlobalSettings, Product, ProductAttributes, ProductVariant } from 'lib/api/types';
import { Link } from 'lib/i18n/navigation';
import { buildProductUrlWithCheapestVariant, getFullPath } from 'lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { AddToCart } from '../cart/add-to-cart';
import Price from '../price';
import { SplitPaymentWidget } from '../split-payment-widget';
import { QuickViewGallery } from './quick-view-gallery';
import { QuickViewVariantSelector } from './quick-view-variant-selector';

interface QuickViewContentProps {
  product: Product;
  images: Array<{ path: string; title: string }>;
  attributes: ProductAttributes;
  settings: GlobalSettings;
  selectedVariant: ProductVariant | null;
  selectedAttributes: Record<string, string>;
  onClose: () => void;
  onAttributeChange: (attribute: string, value: string) => void;
  showCloseButton?: boolean;
}

export function QuickViewContent({
  product,
  images,
  attributes,
  settings,
  selectedVariant,
  selectedAttributes,
  onClose,
  onAttributeChange,
  showCloseButton = true
}: QuickViewContentProps) {
  const t = useTranslations('QuickView');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Use selected variant prices if available, otherwise fall back to product prices
  const displayPrice = selectedVariant ? selectedVariant.final_price : product.final_price;
  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = originalPrice > displayPrice;

  const availableForSale = (function isAvailableForSale() {
    if (selectedVariant) {
      return selectedVariant.stock > product.min_stock;
    }
    return product.stock > 0;
  })();

  const productUrl = buildProductUrlWithCheapestVariant(product);

  return (
    <>
      {/* Close button */}
      {showCloseButton && (
        <button
          onClick={onClose}
          className={clsx(
            'absolute top-4 z-10 rounded-full p-2',
            'bg-white/90 backdrop-blur-sm dark:bg-neutral-800/90',
            'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white',
            'transition-colors duration-200',
            'border border-neutral-200 dark:border-neutral-700',
            isRTL ? 'left-4' : 'right-4'
          )}
          aria-label={t('close')}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Gallery Section */}
        <div className="p-4 md:w-1/2 md:p-6">
          <QuickViewGallery
            images={images.map((image) => ({
              src: getFullPath(image.path),
              altText: image.title
            }))}
            selectedVariant={selectedVariant}
          />
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col p-4 md:w-1/2 md:p-6">
          {/* Title and Price */}
          <div className="mb-4 border-b border-neutral-200 pb-4 dark:border-neutral-700">
            <h2
              className={clsx(
                'mb-3 text-xl font-semibold text-neutral-900 dark:text-white',
                showCloseButton && (isRTL ? 'pl-12' : 'pr-12')
              )}
            >
              {product.title}
            </h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary-600 px-3 py-1.5 text-sm font-medium text-white">
                <Price
                  amount={displayPrice.toString()}
                  currencyCode={settings.site_global_currency}
                />
              </span>
              {hasDiscount && (
                <Price
                  className="text-sm text-neutral-500 line-through"
                  amount={originalPrice.toString()}
                  currencyCode={settings.site_global_currency}
                />
              )}
            </div>

            {/* Payment widget */}
            <div className="mt-3">
              <SplitPaymentWidget price={displayPrice} currency={settings.site_global_currency} />
            </div>
          </div>

          {/* Variant Selector */}
          <div className="flex-grow">
            <QuickViewVariantSelector
              options={attributes}
              variants={product.variants}
              minStock={product.min_stock}
              selectedAttributes={selectedAttributes}
              onAttributeChange={onAttributeChange}
            />
          </div>

          {/* Add to Cart */}
          <div className="mt-auto space-y-3">
            <AddToCart
              product={product}
              selectedVariant={selectedVariant}
              availableForSale={availableForSale}
            />

            {/* View Details Link */}
            <Link
              href={productUrl}
              onClick={onClose}
              className={clsx('button-secondary block w-full text-center')}
            >
              {t('viewDetails')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
