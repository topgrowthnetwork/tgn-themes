'use client';

import clsx from 'clsx';
import { ProductAttributes, ProductVariant } from 'lib/api/types';
import { createVariantCombinations, isOptionValueAvailable, VariantCombination } from 'lib/utils';
import { useQueryState } from 'nuqs';

export function VariantSelector({
  options,
  variants,
  minStock = 0
}: {
  options: ProductAttributes;
  variants: ProductVariant[];
  minStock?: number;
}) {
  const hasNoOptionsOrJustOneOption =
    !Object.keys(options).length ||
    (Object.keys(options).length === 1 && Object.values(options)[0]?.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: VariantCombination[] = createVariantCombinations(variants, minStock);

  return Object.keys(options).map((option) => {
    const optionNameLowerCase = option.toLowerCase();
    const [attributeValue, setAttributeValue] = useQueryState(optionNameLowerCase);

    // Get all currently selected attributes (except the current one)
    const selectedAttributes: Record<string, string> = {};
    Object.keys(options).forEach((attr) => {
      if (attr.toLowerCase() !== optionNameLowerCase) {
        const [value] = useQueryState(attr.toLowerCase());
        if (value) {
          selectedAttributes[attr.toLowerCase()] = value;
        }
      }
    });

    return (
      <dl className="mb-8" key={option}>
        <dt className="mb-4 text-sm uppercase tracking-wide">{option}</dt>
        <dd className="flex flex-wrap gap-3">
          {options[option]?.map((value) => {
            const isActive = attributeValue === value.value;

            // Check if this option value would result in an available variant
            const wouldBeAvailable = isOptionValueAvailable(
              option,
              value.value,
              selectedAttributes,
              combinations
            );

            return (
              <button
                key={value.value}
                aria-disabled={!wouldBeAvailable}
                disabled={!wouldBeAvailable}
                onClick={() => {
                  if (wouldBeAvailable) {
                    setAttributeValue(value.value, { shallow: false });
                  }
                }}
                title={`${option} ${value.value}${!wouldBeAvailable ? ' (Out of Stock)' : ''}`}
                className={clsx(
                  'relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border text-xs transition duration-300 ease-in-out hover:scale-110',
                  {
                    'cursor-default ring-2 ring-primary-600': isActive,
                    'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-primary-600':
                      !isActive && wouldBeAvailable,
                    'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                      !wouldBeAvailable
                  }
                )}
              >
                {value.value}
              </button>
            );
          })}
        </dd>
      </dl>
    );
  });
}
