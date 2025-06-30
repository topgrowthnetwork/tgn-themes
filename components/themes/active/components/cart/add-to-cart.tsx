'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { addItemV2 } from '@shared/components/cart-actions';
import clsx from 'clsx';
import { ProductVariant } from 'lib/api/types';
import { useTranslations } from 'next-intl';
import { useFormState, useFormStatus } from 'react-dom';
import LoadingDots from '../loading-dots';
import { NotificationMessage } from '../notification-message';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  selectedVariant
}: {
  availableForSale: boolean;
  selectedVariantId: number | undefined;
  selectedVariant: ProductVariant | null;
}) {
  const { pending } = useFormStatus();
  const t = useTranslations('Cart');
  const buttonClasses = 'button w-full relative';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        {t('outOfStock')}
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label={t('pleaseSelectOption')}
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ms-4">
          <PlusIcon className="h-5" />
        </div>
        {t('addToCart')}
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label={t('addToCart')}
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="absolute left-0 ms-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : <PlusIcon className="h-5" />}
      </div>
      {t('addToCart')}
    </button>
  );
}

export function AddToCart({
  selectedVariant,
  availableForSale
}: {
  selectedVariant: ProductVariant | null;
  availableForSale: boolean;
}) {
  const [message, formAction] = useFormState(addItemV2, null);
  const selectedVariantId = selectedVariant?.id;
  const selectedProductId = selectedVariant?.product_id;

  // Check if the selected variant is out of stock
  const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;

  const actionWithVariant = formAction.bind(null, {
    selectedProductId: selectedProductId || NaN,
    selectedVariantId: selectedVariantId || NaN
  });

  // Determine notification type based on message content
  const getNotificationType = () => {
    if (!message) return 'info';
    return message.includes('Error') ? 'error' : 'success';
  };

  return (
    <div className="space-y-3">
      <form action={actionWithVariant}>
        <SubmitButton
          availableForSale={availableForSale}
          selectedVariantId={selectedVariantId}
          selectedVariant={selectedVariant}
        />
      </form>

      <NotificationMessage message={message} type={getNotificationType()} />
    </div>
  );
}
