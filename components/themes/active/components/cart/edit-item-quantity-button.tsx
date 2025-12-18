'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ToastNotification } from '@shared/components/toast-notification';
import clsx from 'clsx';
import { createApi } from 'lib/api';
import { ActionResponse, CartItemDetail } from 'lib/api/types';
import { useCart } from 'lib/context/cart-context';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import LoadingDots from '../loading-dots';

function QuantityButton({
  type,
  item,
  disabled,
  loading,
  onClick
}: {
  type: 'plus' | 'minus';
  item: any;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}) {
  const t = useTranslations('Cart');

  return (
    <button
      aria-label={type === 'plus' ? t('increaseItemQuantity') : t('reduceItemQuantity')}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!loading && !disabled) {
          onClick();
        }
      }}
      disabled={loading || disabled}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200',
        {
          'hover:border-neutral-800 dark:hover:border-white': !disabled && !loading,
          'cursor-not-allowed opacity-50': disabled || loading,
          'border-neutral-200 dark:border-neutral-700': disabled || loading
        }
      )}
    >
      {loading ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : (
        <span
          className={clsx('mx-1 h-4 w-4', {
            'text-black dark:text-white': !disabled && !loading,
            'text-neutral-400 dark:text-neutral-600': disabled || loading
          })}
        >
          {type === 'plus' ? (
            <PlusIcon className="h-full w-full" />
          ) : (
            <MinusIcon className="h-full w-full" />
          )}
        </span>
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  minStock = 0
}: {
  item: CartItemDetail;
  type: 'plus' | 'minus';
  minStock?: number;
}) {
  const { setCartResponse } = useCart();
  const locale = useLocale();
  const [cookies] = useCookies(['guest_token']);
  const [state, setState] = useState<ActionResponse>({
    message: '',
    success: false
  });
  const [loading, setLoading] = useState(false);

  const quantity = type === 'plus' ? item.qyt + 1 : item.qyt - 1;

  const canIncrease = (function canIncrease() {
    const availableStock = item.variant ? item.variant.stock : item.product.stock;

    return availableStock > quantity + minStock;
  })();

  // Disable plus button if no stock available or below min_stock
  const isDisabled = type === 'plus' && !canIncrease;

  const handleUpdateQuantity = async () => {
    if (loading || isDisabled) return;

    setLoading(true);
    setState({ message: '', success: false });

    try {
      const guestToken = cookies.guest_token;
      const api = createApi({ language: locale, guestToken });

      // If quantity is 0 or less, remove the item instead
      if (quantity <= 0) {
        const deleteResult = await api.deleteCartItem(item.id);

        if (deleteResult.isErr()) {
          setState({
            message: 'Failed to remove item from cart.',
            success: false
          });
          setLoading(false);
          return;
        }
      } else {
        // Otherwise update the quantity normally
        const updateResult = await api.updateCartItem(item.id, { qyt: quantity });

        if (updateResult.isErr()) {
          setState({
            message: 'Failed to update item quantity.',
            success: false
          });
          setLoading(false);
          return;
        }
      }

      // Fetch updated cart data
      const cartResult = await api.getCart();
      const cartData = cartResult.isOk() ? cartResult.value.data : undefined;

      setState({
        message:
          quantity <= 0 ? 'Removed from cart successfully' : 'Updated item quantity successfully',
        success: true,
        cartData
      });

      // Update cart context
      if (cartData) {
        setCartResponse(cartData);
      }
    } catch (error: any) {
      setState({
        message: quantity <= 0 ? 'Error removing item from cart.' : 'Error updating item quantity.',
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <QuantityButton
        type={type}
        item={item}
        disabled={isDisabled}
        loading={loading}
        onClick={handleUpdateQuantity}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {state.message}
      </p>

      <ToastNotification
        type={state.success ? 'success' : 'error'}
        message={state.message || null}
        autoClose={3000}
      />
    </>
  );
}
