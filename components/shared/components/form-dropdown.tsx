'use client';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
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
}

export default function FormDropdown({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  disabled = false
}: FormDropdownProps) {
  const selectedOption = options.find((option) => option.name === value);

  return (
    <div>
      <label className="form-label">{label}</label>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={clsx(
              'form-input cursor-pointer bg-white text-start',
              disabled && 'cursor-not-allowed opacity-50',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
          >
            <span className={clsx('block truncate', !selectedOption && 'text-gray-500')}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pe-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-default select-none py-2 pe-4 ps-10',
                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                    )
                  }
                  value={option.name}
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
                            'absolute inset-y-0 left-0 flex items-center ps-3',
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
