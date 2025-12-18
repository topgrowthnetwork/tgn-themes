'use client';

import { ExpandableContent } from '@shared/components/expandable-content';
import { Product, ProductAttributes, ProductVariant } from 'lib/api/types';
import { AddToCart } from '../cart/add-to-cart';
import Price from '../price';
import Prose from '../prose';
import { SplitPaymentWidget } from '../split-payment-widget';
import { VariantSelector } from './variant-selector';

export function ProductDescription({
  product,
  attributes,
  currency,
  selectedVariant
}: {
  product: Product;
  attributes: ProductAttributes;
  currency: string;
  selectedVariant: ProductVariant | null;
}) {
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

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-xl font-medium lg:text-3xl">{product.title}</h1>
        <div className="flex items-center">
          <div className=" flex w-auto flex-none items-center rounded-full bg-primary-600 p-2 text-sm text-white">
            <Price amount={displayPrice.toString()} currencyCode={currency} />
          </div>
          {hasDiscount && (
            <Price
              className="me-auto ms-2 text-xs line-through opacity-70"
              amount={originalPrice.toString()}
              currencyCode={currency}
            />
          )}
        </div>
        <div className="mt-3">
          <SplitPaymentWidget price={displayPrice} currency={currency} />
        </div>
      </div>
      <VariantSelector
        options={attributes}
        variants={product.variants}
        minStock={product.min_stock}
      />

      {product.description ? (
        <ExpandableContent className="mb-6">
          <Prose
            className="text-sm leading-tight dark:text-white/[60%]"
            html={product.description}
          />
        </ExpandableContent>
      ) : null}

      <AddToCart
        product={product}
        selectedVariant={selectedVariant}
        availableForSale={availableForSale}
      />
    </>
  );
}
