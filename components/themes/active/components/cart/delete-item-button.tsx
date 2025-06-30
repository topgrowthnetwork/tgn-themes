'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { removeItemV2 } from '@shared/components/cart-actions';
import { ToastNotification } from '@shared/components/toast-notification';

import { useTranslations } from 'next-intl';
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
        <LoadingDots className="bg-white" />
      ) : (
        <TrashIcon className="mx-[1px] h-4 w-4 text-white transition-all ease-in-out hover:text-white" />
      )}
    </button>
  );
}

export function DeleteItemButton({ item }: { item: any }) {
  const [state, formAction] = useFormState(removeItemV2, {
    message: '',
    success: false
  });

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
