'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { addItemV2 } from '@shared/components/cart-actions';
import { ToastNotification } from '@shared/components/toast-notification';
import clsx from 'clsx';
import { Product, ProductAttributes, ProductVariant } from 'lib/api/types';
import { useRouter } from 'lib/i18n/navigation';
import {
  buildProductUrlWithCheapestVariant,
  createVariantCombinations,
  getCheapestVariant,
  getFullPath,
  isOptionValueAvailable
} from 'lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useFormState } from 'react-dom';
import LoadingDots from './loading-dots';

interface ProductCardProps {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
  currency?: string;
}

// Helper function to extract attributes from variants
function extractAttributesFromVariants(variants: ProductVariant[]): ProductAttributes {
  const attributes: ProductAttributes = {};

  variants.forEach((variant) => {
    variant.attribute_values.forEach((attrValue) => {
      const attributeName = attrValue.attribute.name;
      if (!attributes[attributeName]) {
        attributes[attributeName] = [];
      }

      // Check if this value already exists
      const existingValue = attributes[attributeName].find((v) => v.value === attrValue.value);
      if (!existingValue) {
        attributes[attributeName].push({
          value: attrValue.value,
          hex: attrValue.hex || undefined
        });
      }
    });
  });

  return attributes;
}

export function ProductCard({
  product,
  className = '',
  sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  priority = false,
  currency
}: ProductCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Cart');
  const currencyCode = currency || 'EGP';
  const isRTL = locale === 'ar';

  // Extract attributes from variants
  const productAttributes = useMemo(() => {
    return extractAttributesFromVariants(product.variants || []);
  }, [product.variants]);

  // Initialize with cheapest variant
  const cheapestVariant = getCheapestVariant(product);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(cheapestVariant);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [state, formAction] = useFormState(addItemV2, {
    message: '',
    success: false
  });

  // Create variant combinations for availability checking
  const combinations = createVariantCombinations(product.variants || [], 0);

  // Update selected variant when attributes change
  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0) {
      setSelectedVariant(cheapestVariant);
      return;
    }

    const matchingVariant = product.variants?.find((variant) => {
      return Object.entries(selectedAttributes).every(([attrName, attrValue]) => {
        const variantAttribute = variant.attribute_values?.find(
          (attrValue) => attrValue.attribute.name.toLowerCase() === attrName.toLowerCase()
        );
        return variantAttribute?.value === attrValue;
      });
    });

    setSelectedVariant(matchingVariant || cheapestVariant);
  }, [selectedAttributes, product.variants, cheapestVariant]);

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName.toLowerCase()]: value
    }));
  };

  const handleProductClick = () => {
    const params = new URLSearchParams();
    Object.entries(selectedAttributes).forEach(([key, value]) => {
      params.set(key, value);
    });

    const baseUrl = buildProductUrlWithCheapestVariant(product);
    const urlWithParams = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    router.push(urlWithParams);
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariant || isAddingToCart) return;

    setIsAddingToCart(true);

    const actionWithVariant = formAction.bind(null, {
      selectedProductId: selectedVariant.product_id || NaN,
      selectedVariantId: selectedVariant.id || NaN
    });

    await actionWithVariant();
    setIsAddingToCart(false);
  };

  const currentPrice = selectedVariant
    ? selectedVariant.final_price.toString()
    : product.final_price.toString();

  const originalPrice = selectedVariant
    ? selectedVariant.price.toString()
    : product.price.toString();

  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const hasVariants = Object.keys(productAttributes).length > 0;

  return (
    <div className={clsx('block space-y-3 rounded-theme bg-white p-4 shadow-sm', className)}>
      {/* Product Image */}

      <Link
        href={buildProductUrlWithCheapestVariant(product)}
        className="group block aspect-[5/4] overflow-hidden rounded-theme"
        data-testid="product-card-link"
      >
        <Image
          alt={product.title}
          src={getFullPath(product.thumbnail?.path)}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          width={0}
          height={0}
        />
      </Link>

      {/* Product Name */}
      <div className="space-y-2">
        <h3 className="line-clamp-2 cursor-pointer font-medium">
          <Link
            href={buildProductUrlWithCheapestVariant(product)}
            className="hover:text-primary-600 dark:hover:text-primary-400"
          >
            {product.title}
          </Link>
        </h3>

        {/* Variant Options */}
        {hasVariants &&
          Object.entries(productAttributes).map(([optionName, optionValues]) => {
            if (!optionValues || optionValues.length <= 1) return null;

            const isColorOption = optionValues.some((value) => value.hex);

            return (
              <div key={optionName} className="flex flex-wrap gap-2">
                {optionValues.map((value) => {
                  const isActive = selectedAttributes[optionName.toLowerCase()] === value.value;

                  // Check availability
                  const otherSelectedAttributes = { ...selectedAttributes };
                  delete otherSelectedAttributes[optionName.toLowerCase()];

                  const wouldBeAvailable = isOptionValueAvailable(
                    optionName,
                    value.value,
                    otherSelectedAttributes,
                    combinations
                  );

                  if (isColorOption && value.hex) {
                    // Color option with hex background
                    return (
                      <button
                        key={value.value}
                        aria-disabled={!wouldBeAvailable}
                        disabled={!wouldBeAvailable}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (wouldBeAvailable) {
                            handleAttributeChange(optionName, value.value);
                          }
                        }}
                        title={`${optionName} ${value.value}${
                          !wouldBeAvailable ? ' (Out of Stock)' : ''
                        }`}
                        className={clsx(
                          'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition duration-300 ease-in-out hover:scale-110',
                          {
                            'border-primary-600 ring-2 ring-primary-600': isActive,
                            'border-gray-300 hover:border-primary-600':
                              !isActive && wouldBeAvailable,
                            'cursor-not-allowed border-gray-200 opacity-50 hover:!scale-100':
                              !wouldBeAvailable
                          }
                        )}
                        style={{ backgroundColor: value.hex }}
                      >
                        {!wouldBeAvailable && (
                          <div className="absolute inset-0 rounded-full bg-white/50">
                            <div className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-400"></div>
                          </div>
                        )}
                      </button>
                    );
                  }

                  // Non-color option (rectangular)
                  return (
                    <button
                      key={value.value}
                      aria-disabled={!wouldBeAvailable}
                      disabled={!wouldBeAvailable}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (wouldBeAvailable) {
                          handleAttributeChange(optionName, value.value);
                        }
                      }}
                      title={`${optionName} ${value.value}${
                        !wouldBeAvailable ? ' (Out of Stock)' : ''
                      }`}
                      className={clsx(
                        'relative flex h-8 min-w-8 cursor-pointer items-center justify-center rounded border px-2 text-xs transition duration-300 ease-in-out hover:scale-105',
                        {
                          'border-primary-600 bg-primary-600 text-white': isActive,
                          'border-gray-300 bg-white text-gray-700 hover:border-primary-600 hover:text-primary-600':
                            !isActive && wouldBeAvailable,
                          'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 hover:!scale-100':
                            !wouldBeAvailable
                        }
                      )}
                    >
                      {value.value}
                      {!wouldBeAvailable && (
                        <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-400"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

        {/* Add to Cart Button with Price */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className={clsx(
            'flex w-full items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors',
            {
              'bg-primary-600 text-white hover:bg-primary-700': !isOutOfStock && !isAddingToCart,
              'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400':
                isOutOfStock || isAddingToCart
            }
          )}
        >
          <div className={clsx('flex items-center', isRTL ? 'flex-row-reverse' : 'flex-row')}>
            {isAddingToCart ? (
              <LoadingDots className="bg-white dark:bg-gray-800" />
            ) : (
              <>
                <PlusIcon className="h-4 w-4" />
                <span className="mx-2">
                  {isOutOfStock ? (
                    t('outOfStock')
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>
                        {currentPrice} {currencyCode}
                      </span>
                      {originalPrice !== currentPrice && (
                        <span className="text-xs line-through opacity-75">
                          {originalPrice} {currencyCode}
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Toast Notification */}
      <ToastNotification
        type={state.success ? 'success' : 'error'}
        message={state.message}
        autoClose={3000}
      />
    </div>
  );
}
