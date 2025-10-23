'use client';

import { RadioGroup, RadioGroupItem } from '@theme/components/ui/radio-group';
import clsx from 'clsx';
import { ProductAttributes, ProductVariant } from 'lib/api/types';
import { createVariantCombinations, isOptionValueAvailable, VariantCombination } from 'lib/utils';
import { useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function VariantSelector({
  options,
  variants,
  minStock = 0
}: {
  options: ProductAttributes;
  variants: ProductVariant[];
  minStock?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const hasNoOptionsOrJustOneOption =
    !Object.keys(options).length ||
    (Object.keys(options).length === 1 && Object.values(options)[0]?.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: VariantCombination[] = createVariantCombinations(variants, minStock);

  return Object.keys(options).map((option) => {
    const optionNameLowerCase = option.toLowerCase();
    const attributeValue = searchParams.get(optionNameLowerCase) || '';

    // Get all currently selected attributes (except the current one)
    const selectedAttributes: Record<string, string> = {};
    Object.keys(options).forEach((attr) => {
      if (attr.toLowerCase() !== optionNameLowerCase) {
        const value = searchParams.get(attr.toLowerCase());
        if (value) {
          selectedAttributes[attr.toLowerCase()] = value;
        }
      }
    });

    return (
      <div className="mb-8" key={option}>
        <p className="mb-4 text-sm font-medium uppercase tracking-wide">{option}</p>
        <RadioGroup
          value={attributeValue}
          onValueChange={(newValue) => {
            const nextParams = new URLSearchParams(searchParams?.toString());
            nextParams.set(optionNameLowerCase, newValue);
            router.push(`${pathname}?${nextParams.toString()}`);
          }}
          className="flex flex-wrap gap-4"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {options[option]?.map((value) => {
            // Check if this option value would result in an available variant
            const wouldBeAvailable = isOptionValueAvailable(
              option,
              value.value,
              selectedAttributes,
              combinations
            );

            return (
              <div key={value.value} className="flex items-center gap-x-2">
                <RadioGroupItem
                  value={value.value}
                  id={`${optionNameLowerCase}-${value.value}`}
                  disabled={!wouldBeAvailable}
                  className={clsx({
                    'opacity-50': !wouldBeAvailable
                  })}
                />
                <label
                  htmlFor={`${optionNameLowerCase}-${value.value}`}
                  className={clsx(
                    'cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                    {
                      'cursor-not-allowed opacity-50': !wouldBeAvailable,
                      'line-through': !wouldBeAvailable
                    }
                  )}
                >
                  {value.value}
                  {!wouldBeAvailable && ' (Out of Stock)'}
                </label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    );
  });
}
