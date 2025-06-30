'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { updateItemQuantityV2 } from '@shared/components/cart-actions';
import { ToastNotification } from '@shared/components/toast-notification';
import clsx from 'clsx';
import { CartResponse } from 'lib/api/types';

import { useTranslations } from 'next-intl';
import { useFormState, useFormStatus } from 'react-dom';
import LoadingDots from '../loading-dots';

function SubmitButton({
  type,
  item,
  disabled
}: {
  type: 'plus' | 'minus';
  item: any;
  disabled?: boolean;
}) {
  const t = useTranslations('Cart');
  const { pending } = useFormStatus();

  return (
    <button
      aria-label={type === 'plus' ? t('increaseItemQuantity') : t('reduceItemQuantity')}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending || disabled) e.preventDefault();
      }}
      disabled={pending || disabled}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200',
        {
          'hover:border-neutral-800 dark:hover:border-white': !disabled,
          'cursor-not-allowed opacity-50': disabled,
          'border-neutral-200 dark:border-neutral-700': disabled
        }
      )}
    >
      {pending ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : (
        <span
          className={clsx('mx-1 h-4 w-4', {
            'text-black dark:text-white': !disabled,
            'text-neutral-400 dark:text-neutral-600': disabled
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
  item: CartResponse['cart']['cart_items'][number];
  type: 'plus' | 'minus';
  minStock?: number;
}) {
  const [state, formAction] = useFormState(updateItemQuantityV2, {
    message: '',
    success: false
  });

  const quantity = type === 'plus' ? item.qyt + 1 : item.qyt - 1;

  const canIncrease = (function canIncrease() {
    const availableStock = item.variant?.stock;

    return availableStock > quantity + minStock;
  })();

  // Disable plus button if no stock available or below min_stock
  const isDisabled = type === 'plus' && !canIncrease;

  return (
    <>
      <form action={formAction.bind(null, { lineId: item.id, quantity })}>
        <SubmitButton type={type} item={item} disabled={isDisabled} />
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
