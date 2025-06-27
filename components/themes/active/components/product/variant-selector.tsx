'use client';

import clsx from 'clsx';
import { ProductAttributes, ProductVariant } from 'lib/api/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants
}: {
  options: ProductAttributes;
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !Object.keys(options).length ||
    (Object.keys(options).length === 1 && Object.values(options)[0]?.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id.toString(),
    availableForSale: variant.stock > 0,
    ...variant.attribute_values.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.attribute.name.toLowerCase()]: option.value
      }),
      {}
    )
  }));

  return Object.keys(options).map((option) => (
    <dl className="mb-8" key={option}>
      <dt className="mb-4 text-sm uppercase tracking-wide">{option}</dt>
      <dd className="flex flex-wrap gap-3">
        {options[option]?.map((value) => {
          const optionNameLowerCase = option.toLowerCase();

          const optionSearchParams = new URLSearchParams(searchParams.toString());
          optionSearchParams.set(optionNameLowerCase, value.value);
          const optionUrl = createUrl(pathname, optionSearchParams);

          const filtered = Array.from(optionSearchParams.entries()).filter(
            ([key, value]) => options[key]?.some((attrValue) => attrValue.value === value)
          );
          const isAvailableForSale = combinations.find((combination) =>
            filtered.every(
              ([key, value]) => combination[key] === value && combination.availableForSale
            )
          );

          const isActive = searchParams.get(optionNameLowerCase) === value.value;

          return (
            <button
              key={value.value}
              aria-disabled={!isAvailableForSale}
              disabled={!isAvailableForSale}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
              title={`${option} ${value.value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
              className={clsx(
                'relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border text-xs transition duration-300 ease-in-out hover:scale-110',
                {
                  'cursor-default ring-2 ring-primary-600': isActive,
                  'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-primary-600 ':
                    !isActive && isAvailableForSale,
                  'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                    !isAvailableForSale
                }
              )}
            >
              {value.value}
            </button>
          );
        })}
      </dd>
    </dl>
  ));
}
