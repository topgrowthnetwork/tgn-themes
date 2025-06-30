'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { CheckoutRequest, City, Country, State } from 'lib/api/types';
import { useAddressCascade } from 'lib/hooks/use-address-cascade';
import { useFormPersistence } from 'lib/hooks/use-form-persistence';
import { useShippingStorage } from 'lib/hooks/use-shipping-storage';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import FieldError from './field-error';
import FormDropdown from './form-dropdown';

const shippingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone is required'),
  shipping_address: z.object({
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    address: z.string().min(1, 'Address is required')
  })
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  formData: Partial<CheckoutRequest>;
  onFormDataChange: (data: ShippingFormData) => void;
  onSubmit: () => void;
  isActive: boolean;
  onEdit?: () => void;
  countries: Country[];
  states: State[];
  cities: City[];
}

export default function ShippingForm({
  formData,
  onFormDataChange,
  onSubmit,
  isActive,
  onEdit,
  countries,
  states,
  cities
}: ShippingFormProps) {
  const t = useTranslations('Checkout');
  const { isLoaded } = useShippingStorage();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      shipping_address: {
        country: formData.shipping_address?.country || '',
        state: formData.shipping_address?.state || '',
        city: formData.shipping_address?.city || '',
        address: formData.shipping_address?.address || ''
      }
    }
  });

  // Use form persistence hook for automatic localStorage handling
  const { saveStoredData } = useFormPersistence({
    storageKey: 'checkout_shipping_data',
    formData,
    reset,
    isLoaded
  });

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
    if (formData.shipping_address?.country !== country) {
      setValue('shipping_address.state', '');
      setValue('shipping_address.city', '');
      clearState();
      clearCity();
    }
    setValue('shipping_address.country', country);
  };

  const handleStateChange = (state: string) => {
    if (formData.shipping_address?.state !== state) {
      setValue('shipping_address.city', '');
      clearCity();
    }
    setValue('shipping_address.state', state);
  };

  const watchedValues = watch();

  const handleFormSubmit = (data: ShippingFormData) => {
    // Save to localStorage
    saveStoredData(data);

    // Update parent component
    onFormDataChange(data);
    onSubmit();
  };

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
          <button onClick={onEdit} className="button-secondary">
            {t('edit')}
          </button>
        )}
      </div>

      {isActive && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">{t('name')} *</label>
              <input type="text" {...register('name')} className="input" />
              {errors.name && <FieldError message={errors.name.message} />}
            </div>
            <div>
              <label className="label">{t('email')} *</label>
              <input type="email" {...register('email')} className="input" />
              {errors.email && <FieldError message={errors.email.message} />}
            </div>
          </div>

          <div>
            <label className="label">{t('phone')} *</label>
            <input type="tel" {...register('phone')} className="input" />
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
                />
              )}
            />
          </div>

          <div>
            <label className="label">{t('address')} *</label>
            <textarea {...register('shipping_address.address')} rows={3} className="textarea" />
            <FieldError message={errors.shipping_address?.address?.message} />
          </div>

          <button type="submit" className="button">
            {t('next')}
          </button>
        </form>
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
