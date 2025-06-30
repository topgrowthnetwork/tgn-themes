'use client';

import clsx from 'clsx';
import { City, Country, State } from 'lib/api/types';
import { useAddressCascade } from 'lib/hooks/use-address-cascade';
import { useTranslations } from 'next-intl';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import FieldError from './field-error';
import FormDropdown from './form-dropdown';

interface ShippingFormData {
  name: string;
  email: string;
  phone: string;
  shipping_address: {
    country: string;
    state: string;
    city: string;
    address: string;
  };
  payment_gateway: string;
  wallet_number?: string;
  receipt_image?: string;
  coupon_code?: string;
}

interface ShippingFormProps {
  register: UseFormRegister<ShippingFormData>;
  control: Control<ShippingFormData>;
  errors: FieldErrors<ShippingFormData>;
  watch: UseFormWatch<ShippingFormData>;
  setValue: UseFormSetValue<ShippingFormData>;
  onNext: () => void;
  isActive: boolean;
  onEdit?: () => void;
  countries: Country[];
  states: State[];
  cities: City[];
}

export default function ShippingForm({
  register,
  control,
  errors,
  watch,
  setValue,
  onNext,
  isActive,
  onEdit,
  countries,
  states,
  cities
}: ShippingFormProps) {
  const t = useTranslations('Checkout');

  const watchedCountry = watch('shipping_address.country');
  const watchedState = watch('shipping_address.state');

  // Use custom hook for address cascade logic
  const { availableStates, availableCities, clearState, clearCity } = useAddressCascade({
    countries,
    states,
    cities,
    selectedCountry: watchedCountry,
    selectedState: watchedState
  });

  // Clear dependent fields when parent selection changes
  const handleCountryChange = (country: string) => {
    if (watchedCountry !== country) {
      setValue('shipping_address.state', '');
      setValue('shipping_address.city', '');
      clearState();
      clearCity();
    }
    setValue('shipping_address.country', country);
  };

  const handleStateChange = (state: string) => {
    if (watchedState !== state) {
      setValue('shipping_address.city', '');
      clearCity();
    }
    setValue('shipping_address.state', state);
  };

  const watchedValues = watch();

  return (
    <div
      className={clsx(
        'mb-8 rounded-theme border p-6',
        isActive
          ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
          : 'border-gray-200'
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('shippingAddress')}</h2>
        {!isActive && onEdit && (
          <button type="button" onClick={onEdit} className="button-secondary">
            {t('edit')}
          </button>
        )}
      </div>

      {isActive && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">{t('name')} *</label>
              <input
                type="text"
                {...register('name')}
                className="input"
                data-testid="shipping-form-name"
              />
              {errors.name && <FieldError message={errors.name.message} />}
            </div>
            <div>
              <label className="label">{t('email')} *</label>
              <input
                type="email"
                {...register('email')}
                className="input"
                data-testid="shipping-form-email"
              />
              {errors.email && <FieldError message={errors.email.message} />}
            </div>
          </div>

          <div>
            <label className="label">{t('phone')} *</label>
            <input
              type="tel"
              {...register('phone')}
              className="input"
              data-testid="shipping-form-phone"
            />
            {errors.phone && <FieldError message={errors.phone.message} />}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Controller
              name="shipping_address.country"
              control={control}
              render={({ field }) => (
                <FormDropdown
                  label={`${t('country')} *`}
                  options={countries}
                  value={field.value}
                  onChange={handleCountryChange}
                  error={errors.shipping_address?.country?.message}
                  placeholder={t('selectCountry')}
                  dataTestId="shipping-form-country"
                />
              )}
            />

            <Controller
              name="shipping_address.state"
              control={control}
              render={({ field }) => (
                <FormDropdown
                  label={`${t('state')} *`}
                  options={availableStates}
                  value={field.value}
                  onChange={handleStateChange}
                  error={errors.shipping_address?.state?.message}
                  placeholder={t('selectState')}
                  disabled={!watchedCountry}
                  dataTestId="shipping-form-state"
                />
              )}
            />

            <Controller
              name="shipping_address.city"
              control={control}
              render={({ field }) => (
                <FormDropdown
                  label={`${t('city')} *`}
                  options={availableCities}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.shipping_address?.city?.message}
                  placeholder={t('selectCity')}
                  disabled={!watchedState}
                  dataTestId="shipping-form-city"
                />
              )}
            />
          </div>

          <div>
            <label className="label">{t('address')} *</label>
            <textarea
              {...register('shipping_address.address')}
              rows={3}
              className="textarea"
              data-testid="shipping-form-address"
            />
            <FieldError message={errors.shipping_address?.address?.message} />
          </div>

          <button
            type="button"
            onClick={onNext}
            className="button"
            data-testid="shipping-form-next"
          >
            {t('next')}
          </button>
        </div>
      )}

      {!isActive && (
        <div className="space-y-2">
          <p>
            <strong>{t('name')}:</strong> {watchedValues.name}
          </p>
          <p>
            <strong>{t('email')}:</strong> {watchedValues.email}
          </p>
          <p>
            <strong>{t('phone')}:</strong> {watchedValues.phone}
          </p>
          <p>
            <strong>{t('address')}:</strong> {watchedValues.shipping_address?.address},{' '}
            {watchedValues.shipping_address?.city}, {watchedValues.shipping_address?.state},{' '}
            {watchedValues.shipping_address?.country}
          </p>
        </div>
      )}
    </div>
  );
}
