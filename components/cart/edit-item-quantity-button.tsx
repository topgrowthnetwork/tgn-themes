'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { updateItemQuantityV2 } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { CartResponse } from 'lib/api/types';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      aria-disabled={pending}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'cursor-not-allowed': pending,
          'ml-auto': type === 'minus'
        }
      )}
    >
      {pending ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : type === 'plus' ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type
}: {
  item: CartResponse['cart']['cart_items'][number];
  type: 'plus' | 'minus';
}) {
  const [message, formAction] = useFormState(updateItemQuantityV2, null);
  const newQuantity = type === 'plus' ? item.qyt + 1 : item.qyt - 1;
  const actionWithVariant = formAction.bind(null, {
    lineId: item.id,
    quantity: newQuantity
  });

  return (
    <form action={actionWithVariant}>
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
