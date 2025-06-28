'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { updateItemQuantityV2 } from '@shared/components/cart-actions';
import { useTranslations } from 'next-intl';
import { useFormState, useFormStatus } from 'react-dom';
import LoadingDots from '../loading-dots';

function SubmitButton({ type, item }: { type: 'plus' | 'minus'; item: any }) {
  const t = useTranslations('Cart');
  const { pending } = useFormStatus();

  console.log('🙈', { pending });

  return (
    <button
      aria-label={type === 'plus' ? t('increaseItemQuantity') : t('reduceItemQuantity')}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      disabled={pending}
      className="ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 dark:hover:border-white"
    >
      {pending ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : (
        <span className="mx-1 h-4 w-4 text-black dark:text-white">
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

export function EditItemQuantityButton({ item, type }: { item: any; type: 'plus' | 'minus' }) {
  const [message, formAction] = useFormState(updateItemQuantityV2, null);

  const quantity = type === 'plus' ? item.qyt + 1 : item.qyt - 1;

  return (
    <form action={formAction.bind(null, { lineId: item.id, quantity })}>
      <SubmitButton type={type} item={item} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
