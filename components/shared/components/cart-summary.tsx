'use client';

import { applyCouponV2 } from '@shared/components/cart-actions';
import { ToastNotification } from '@shared/components/toast-notification';
import LoadingDots from '@theme/components/loading-dots';
import Price from '@theme/components/price';
import { useCart } from 'lib/context/cart-context';
import { useShipping } from 'lib/context/shipping-context';
import { getFullPath, getItemPrice } from 'lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

interface CartSummaryProps {}

function CouponSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const t = useTranslations('Cart');

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="button flex items-center justify-center gap-2"
    >
      {pending && <LoadingDots className="bg-white dark:bg-gray-800" />}
      {t('apply')}
    </button>
  );
}

export default function CartSummary({}: CartSummaryProps) {
  const t = useTranslations('Cart');
  const { cartResponse, currency, setCartResponse } = useCart();
  const { shippingAmount } = useShipping();
  const [state, formAction] = useFormState(applyCouponV2, {
    message: '',
    success: false
  });

  // Update cart context when cart data is returned from server action
  useEffect(() => {
    if (state.success && state.cartData) {
      setCartResponse(state.cartData);
    }
  }, [state.success, state.cartData, setCartResponse]);

  if (!cartResponse.cart || cartResponse.cart.cart_items.length === 0) {
    return null;
  }

  const handleCouponSubmit = (formData: FormData) => {
    const code = formData.get('couponCode') as string;
    if (code?.trim()) {
      return formAction(code.trim());
    }
    return null;
  };

  // Calculate total with shipping
  const totalWithShipping = cartResponse.total_price + shippingAmount;

  return (
    <div className="rounded-theme border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold dark:text-white">{t('orderSummary')}</h3>

      {/* Cart Items */}
      <div className="mb-4 space-y-3">
        {cartResponse.cart.cart_items.slice(0, 3).map((item, index) => {
          const itemPrice = getItemPrice(item.product, item.variant);
          const totalPrice = itemPrice * item.qyt;

          return (
            <div key={index} className="flex items-center gap-x-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-theme border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
                <Image
                  className="h-full w-full object-cover"
                  width={48}
                  height={48}
                  alt={item.product.thumbnail?.title || item.product.title}
                  src={getFullPath(item.product.thumbnail?.path || '')}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {item.product.title}
                </p>
                {item.variant && item.variant.attribute_values.length > 0 ? (
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {item.variant.attribute_values.map(({ value }) => value).join(', ')}
                  </p>
                ) : null}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('quantity')}: {item.qyt}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                <Price amount={totalPrice.toString()} currencyCode={currency} />
              </div>
            </div>
          );
        })}

        {cartResponse.cart.cart_items.length > 3 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            +{cartResponse.cart.cart_items.length - 3} {t('moreItems')}
          </p>
        )}
      </div>

      {/* Coupon Section */}
      <div className="mb-4 border-t border-gray-200 pt-4 dark:border-gray-600">
        <form action={handleCouponSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              name="couponCode"
              placeholder={t('couponCode')}
              className="input flex-1"
            />
            <CouponSubmitButton disabled={false} />
          </div>
          <ToastNotification
            type={state.success ? 'success' : 'error'}
            message={state.message}
            autoClose={3000}
          />
        </form>
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-600">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">{t('subtotal')}</span>
          <Price amount={cartResponse.sub_total.toString()} currencyCode={currency} />
        </div>

        {cartResponse.tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">{t('taxes')}</span>
            <Price amount={cartResponse.tax.toString()} currencyCode={currency} />
          </div>
        )}

        {cartResponse.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">{t('discount')}</span>
            <span className="flex text-green-600 dark:text-green-400">
              -<Price amount={cartResponse.discount.toString()} currencyCode={currency} />
            </span>
          </div>
        )}

        {shippingAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">{t('shipping')}</span>
            <Price amount={shippingAmount.toString()} currencyCode={currency} />
          </div>
        )}

        <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-600">
          <span className="font-semibold text-gray-900 dark:text-white">{t('total')}</span>
          <Price
            className="font-semibold text-gray-900 dark:text-white"
            amount={totalWithShipping.toString()}
            currencyCode={currency}
          />
        </div>
      </div>
    </div>
  );
}
