'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { ToastNotification } from '@shared/components/toast-notification';
import { createApi } from 'lib/api';
import { ActionResponse } from 'lib/api/types';
import { useCart } from 'lib/context/cart-context';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import LoadingDots from '../loading-dots';

function DeleteButton({ item, loading, onClick }: { item: any; loading?: boolean; onClick: () => void }) {
  const t = useTranslations('Cart');

  return (
    <button
      aria-label={t('removeCartItem')}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!loading) {
          onClick();
        }
      }}
      disabled={loading}
      className="ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200 dark:bg-neutral-400 dark:hover:bg-black dark:hover:text-white disabled:opacity-50"
    >
      {loading ? (
        <LoadingDots className="bg-white dark:bg-gray-600" />
      ) : (
        <TrashIcon className="mx-[1px] h-4 w-4 text-white transition-all ease-in-out hover:text-white" />
      )}
    </button>
  );
}

export function DeleteItemButton({ item }: { item: any }) {
  const { setCartResponse } = useCart();
  const locale = useLocale();
  const [cookies] = useCookies(['guest_token']);
  const [state, setState] = useState<ActionResponse>({
    message: '',
    success: false
  });
  const [loading, setLoading] = useState(false);

  const handleDeleteItem = async () => {
    if (loading) return;

    setLoading(true);
    setState({ message: '', success: false });

    try {
      const guestToken = cookies.guest_token;
      const api = createApi({ language: locale, guestToken });

      const result = await api.deleteCartItem(item.id);

      if (result.isErr()) {
        setState({
          message: 'Failed to remove item from cart.',
          success: false
        });
        setLoading(false);
        return;
      }

      // Fetch updated cart data
      const cartResult = await api.getCart();
      const cartData = cartResult.isOk() ? cartResult.value.data : undefined;

      setState({
        message: result.value.message || 'Removed from cart successfully',
        success: true,
        cartData
      });

      // Update cart context
      if (cartData) {
        setCartResponse(cartData);
      }
    } catch (error: any) {
      setState({
        message: 'Error removing item from cart.',
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DeleteButton item={item} loading={loading} onClick={handleDeleteItem} />
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
