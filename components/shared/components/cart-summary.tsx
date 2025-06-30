import { applyCouponV2 } from '@shared/components/cart-actions';
import Price from '@theme/components/price';
import { CartResponse } from 'lib/api/types';
import { getFullPath, getItemPrice } from 'lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { useFormState } from 'react-dom';

interface CartSummaryProps {
  cartResponse: CartResponse;
  currency: string;
}

export default function CartSummary({ cartResponse, currency }: CartSummaryProps) {
  const t = useTranslations('Cart');
  const [couponCode, setCouponCode] = useState('');
  const [message, formAction] = useFormState(applyCouponV2, null);

  if (!cartResponse.cart || cartResponse.cart.cart_items.length === 0) {
    return null;
  }

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      formAction(couponCode.trim());
      setCouponCode('');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h3 className="mb-4 text-lg font-semibold">{t('orderSummary')}</h3>

      {/* Cart Items */}
      <div className="mb-4 space-y-3">
        {cartResponse.cart.cart_items.slice(0, 3).map((item, index) => {
          const itemPrice = getItemPrice(item.product, item.variant);
          const totalPrice = itemPrice * item.qyt;

          return (
            <div key={index} className="flex items-center gap-x-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-md border border-gray-200 bg-white">
                <Image
                  className="h-full w-full object-cover"
                  width={48}
                  height={48}
                  alt={item.product.thumbnail.title || item.product.title}
                  src={getFullPath(item.product.thumbnail.path)}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{item.product.title}</p>
                <p className="text-xs text-gray-500">
                  {t('quantity')}: {item.qyt}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                <Price amount={totalPrice.toString()} currencyCode={currency} />
              </div>
            </div>
          );
        })}

        {cartResponse.cart.cart_items.length > 3 && (
          <p className="text-center text-sm text-gray-500">
            +{cartResponse.cart.cart_items.length - 3} {t('moreItems')}
          </p>
        )}
      </div>

      {/* Coupon Section */}
      <div className="mb-4 border-t border-gray-200 pt-4">
        <form onSubmit={handleCouponSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={t('couponCode')}
              className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={!couponCode.trim()}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('apply')}
            </button>
          </div>
          {message && (
            <p
              className={`text-xs ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('subtotal')}</span>
          <Price amount={cartResponse.sub_total.toString()} currencyCode={currency} />
        </div>

        {cartResponse.tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('taxes')}</span>
            <Price amount={cartResponse.tax.toString()} currencyCode={currency} />
          </div>
        )}

        {cartResponse.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('discount')}</span>
            <span className="flex text-green-600">
              -<Price amount={cartResponse.discount.toString()} currencyCode={currency} />
            </span>
          </div>
        )}

        <div className="flex justify-between border-t border-gray-200 pt-2">
          <span className="font-semibold text-gray-900">{t('total')}</span>
          <Price
            className="font-semibold text-gray-900"
            amount={cartResponse.total_price.toString()}
            currencyCode={currency}
          />
        </div>
      </div>
    </div>
  );
}
