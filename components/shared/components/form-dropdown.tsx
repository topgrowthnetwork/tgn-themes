'use client';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useLocale } from 'next-intl';
import { Fragment } from 'react';

interface Option {
  id: number;
  name: string;
  code?: string | number;
}

interface FormDropdownProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  dataTestId?: string;
  id?: string;
}

export default function FormDropdown({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  disabled = false,
  dataTestId,
  id
}: FormDropdownProps) {
  const getValue = (option: Option) => option.code?.toString() ?? option.name;
  const selectedOption = options.find((option) => getValue(option) === value);
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            id={id}
            className={clsx('input cursor-pointer bg-white text-start dark:bg-gray-800', {
              'border-red-500 focus:border-red-500 focus:ring-red-500': error
            })}
            data-testid={dataTestId}
          >
            <span
              className={clsx(
                'block truncate',
                !selectedOption && 'text-gray-500 dark:text-gray-400'
              )}
            >
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            <span
              className={clsx(
                'pointer-events-none absolute inset-y-0 flex items-center pe-2',
                isRTL ? 'left-0' : 'right-0'
              )}
            >
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-theme bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 sm:text-sm">
              {options.map((option, index) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-default select-none py-2 pe-4 ps-10',
                      active
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-800 dark:text-primary-100'
                        : 'text-gray-900 dark:text-gray-100'
                    )
                  }
                  value={getValue(option)}
                  data-testid={`${dataTestId}-option-${index}`}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span
                          className={clsx(
                            'absolute inset-y-0 left-0 flex items-center ps-3 rtl:right-0',
                            active ? 'text-primary-600' : 'text-primary-600'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
