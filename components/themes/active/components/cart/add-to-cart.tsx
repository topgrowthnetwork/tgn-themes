'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { ToastNotification } from '@shared/components/toast-notification';
import clsx from 'clsx';
import { createApi } from 'lib/api';
import { ActionResponse, Product, ProductVariant } from 'lib/api/types';
import { useCart } from 'lib/context/cart-context';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import LoadingDots from '../loading-dots';

function AddToCartButton({
  availableForSale,
  selectedVariantId,
  selectedVariant,
  loading,
  onClick
}: {
  availableForSale: boolean;
  selectedVariantId: number | undefined;
  selectedVariant: ProductVariant | null;
  loading?: boolean;
  onClick: () => void;
}) {
  const t = useTranslations('Cart');
  const buttonClasses = 'button w-full relative';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';
  const locale = useLocale();
  const isRTL = locale === 'ar';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        {t('outOfStock')}
      </button>
    );
  }

  // if (!selectedVariantId) {
  //   return (
  //     <button
  //       aria-label={t('pleaseSelectOption')}
  //       aria-disabled
  //       className={clsx(buttonClasses, disabledClasses)}
  //     >
  //       <div className="absolute left-0 ms-4 rtl:right-0">
  //         <PlusIcon className="h-5" />
  //       </div>
  //       {t('addToCart')}
  //     </button>
  //   );
  // }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!loading) {
          onClick();
        }
      }}
      aria-label={t('addToCart')}
      aria-disabled={loading}
      className={clsx(buttonClasses, {
        'hover:opacity-90': !loading,
        [disabledClasses]: loading
      })}
      data-testid="add-to-cart-button"
    >
      <div className={clsx('absolute me-4', isRTL ? 'left-0' : 'right-0')}>
        {loading ? (
          <LoadingDots className="mb-3 bg-white dark:bg-gray-800" />
        ) : (
          <PlusIcon className="h-5" />
        )}
      </div>
      {t('addToCart')}
    </button>
  );
}

export function AddToCart({
  selectedVariant,
  availableForSale,
  product
}: {
  product: Product;
  selectedVariant: ProductVariant | null;
  availableForSale: boolean;
}) {
  const { setCartResponse } = useCart();
  const locale = useLocale();
  const [cookies, setCookie] = useCookies(['guest_token', 'cartId']);
  const [state, setState] = useState<ActionResponse>({
    message: '',
    success: false
  });
  const [loading, setLoading] = useState(false);
  const selectedVariantId = selectedVariant?.id;

  // Check if the selected variant is out of stock
  const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;

  const handleAddToCart = async () => {
    if (loading || !availableForSale) return;

    setLoading(true);
    setState({ message: '', success: false });

    try {
      const guestToken = cookies.guest_token;
      const api = createApi({ language: locale, guestToken });

      const result = await api.addToCart({
        qyt: 1,
        product_id: product.id,
        product_variant_id: selectedVariantId || NaN
      });

      if (result.isErr()) {
        setState({
          message: 'Failed to add item to cart.',
          success: false
        });
        setLoading(false);
        return;
      }

      // Set cartId cookie if available
      if (result.value.data.cart_item?.cart_id) {
        setCookie('cartId', result.value.data.cart_item.cart_id.toString(), {
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
      }

      // Fetch updated cart data
      const cartResult = await api.getCart();
      const cartData = cartResult.isOk() ? cartResult.value.data : undefined;

      setState({
        message: result.value.message || 'Added to cart successfully',
        success: true,
        cartData
      });

      // Update cart context
      if (cartData) {
        setCartResponse(cartData);
      }
    } catch (error: any) {
      setState({
        message: 'Error adding item to cart.',
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <AddToCartButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        selectedVariant={selectedVariant}
        loading={loading}
        onClick={handleAddToCart}
      />

      <ToastNotification
        type={state.success ? 'success' : 'error'}
        message={state.message || null}
        autoClose={3000}
      />
    </div>
  );
}
