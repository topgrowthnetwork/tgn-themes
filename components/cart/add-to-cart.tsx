'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItemV2 } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { NotificationMessage } from 'components/notification-message';
import { ProductVariant } from 'lib/api/types';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: number | undefined;
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : <PlusIcon className="h-5" />}
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({
  variants,
  availableForSale
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
}) {
  const [message, formAction] = useFormState(addItemV2, null);
  const searchParams = useSearchParams();
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const defaultProductId = variants.length === 1 ? variants[0]?.product_id : undefined;
  const variant = variants.find((variant: ProductVariant) =>
    variant.attribute_values.every(
      (option) => option.value === searchParams.get(option.attribute.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;
  const selectedProductId = variant?.product_id || defaultProductId;
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
        <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />
      </form>

      <NotificationMessage message={message} type={getNotificationType()} />
    </div>
  );
}
