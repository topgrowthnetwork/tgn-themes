'use client';

import { RadioGroup, RadioGroupItem } from '@theme/components/ui/radio-group';
import clsx from 'clsx';
import { ProductAttributes, ProductVariant } from 'lib/api/types';
import { createVariantCombinations, isOptionValueAvailable, VariantCombination } from 'lib/utils';
import { useLocale } from 'next-intl';

interface QuickViewVariantSelectorProps {
  options: ProductAttributes;
  variants: ProductVariant[];
  minStock?: number;
  selectedAttributes: Record<string, string>;
  onAttributeChange: (attribute: string, value: string) => void;
}

export function QuickViewVariantSelector({
  options,
  variants,
  minStock = 0,
  selectedAttributes,
  onAttributeChange
}: QuickViewVariantSelectorProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const hasNoOptionsOrJustOneOption =
    !Object.keys(options).length ||
    (Object.keys(options).length === 1 && Object.values(options)[0]?.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: VariantCombination[] = createVariantCombinations(variants, minStock);

  return (
    <div className="space-y-4">
      {Object.keys(options).map((option) => {
        const optionNameLowerCase = option.toLowerCase();
        const attributeValue = selectedAttributes[optionNameLowerCase] || '';

        // Get all currently selected attributes (except the current one)
        const otherSelectedAttributes: Record<string, string> = {};
        Object.keys(options).forEach((attr) => {
          if (attr.toLowerCase() !== optionNameLowerCase) {
            const value = selectedAttributes[attr.toLowerCase()];
            if (value) {
              otherSelectedAttributes[attr.toLowerCase()] = value;
            }
          }
        });

        return (
          <div key={option}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {option}
            </p>
            <RadioGroup
              value={attributeValue}
              onValueChange={(newValue) => onAttributeChange(option, newValue)}
              className="flex flex-wrap gap-2"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {options[option]?.map((value) => {
                // Check if this option value would result in an available variant
                const wouldBeAvailable = isOptionValueAvailable(
                  option,
                  value.value,
                  otherSelectedAttributes,
                  combinations
                );

                return (
                  <div key={value.value} className="flex items-center">
                    <RadioGroupItem
                      value={value.value}
                      id={`quick-${optionNameLowerCase}-${value.value}`}
                      disabled={!wouldBeAvailable}
                      className={clsx(
                        'sr-only peer'
                      )}
                    />
                    <label
                      htmlFor={`quick-${optionNameLowerCase}-${value.value}`}
                      className={clsx(
                        'cursor-pointer px-3 py-1.5 text-xs font-medium rounded-md border transition-all duration-200',
                        attributeValue === value.value
                          ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600',
                        {
                          'cursor-not-allowed opacity-40 line-through': !wouldBeAvailable,
                        }
                      )}
                    >
                      {value.value}
                    </label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      })}
    </div>
  );
}

