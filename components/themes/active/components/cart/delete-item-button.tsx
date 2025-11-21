'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { removeItemV2 } from '@shared/components/cart-actions';
import { ToastNotification } from '@shared/components/toast-notification';
import { useCart } from 'lib/context/cart-context';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import LoadingDots from '../loading-dots';

function SubmitButton({ item }: { item: any }) {
  const { pending } = useFormStatus();
  const t = useTranslations('Cart');

  return (
    <button
      aria-label={t('removeCartItem')}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      disabled={pending}
      className="ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200 dark:bg-neutral-400 dark:hover:bg-black dark:hover:text-white"
    >
      {pending ? (
        <LoadingDots className="bg-white dark:bg-gray-600" />
      ) : (
        <TrashIcon className="mx-[1px] h-4 w-4 text-white transition-all ease-in-out hover:text-white" />
      )}
    </button>
  );
}

export function DeleteItemButton({ item }: { item: any }) {
  const { setCartResponse } = useCart();
  const [state, formAction] = useFormState(removeItemV2, {
    message: '',
    success: false
  });

  // Update cart context when cart data is returned from server action
  useEffect(() => {
    if (state.success && state.cartData) {
      setCartResponse(state.cartData);
    }
  }, [state.success, state.cartData, setCartResponse]);

  return (
    <>
      <form action={formAction.bind(null, item.id)}>
        <SubmitButton item={item} />
        <p aria-live="polite" className="sr-only" role="status">
          {state.message}
        </p>
      </form>

      <ToastNotification
        type={state.success ? 'success' : 'error'}
        message={state.message}
        autoClose={3000}
      />
    </>
  );
}
