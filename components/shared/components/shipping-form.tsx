'use client';

import clsx from 'clsx';
import { CheckoutRequest, City, Country, State } from 'lib/api/types';
import { useAddressCascade } from 'lib/hooks/use-address-cascade';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import FieldError from './field-error';
import FormDropdown from './form-dropdown';

interface ShippingFormProps {
  formData: Partial<CheckoutRequest>;
  onFormDataChange: (data: Partial<CheckoutRequest>) => void;
  onNext: () => void;
  isActive: boolean;
  onEdit?: () => void;
  countries: Country[];
  states: State[];
  cities: City[];
}

export default function ShippingForm({
  formData,
  onFormDataChange,
  onNext,
  isActive,
  onEdit,
  countries,
  states,
  cities
}: ShippingFormProps) {
  const t = useTranslations('Checkout');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use custom hook for address cascade logic
  const { availableStates, availableCities, clearState, clearCity } = useAddressCascade({
    countries,
    states,
    cities,
    selectedCountry: formData.shipping_address?.country || '',
    selectedState: formData.shipping_address?.state || ''
  });

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone || formData.phone.length < 6) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.shipping_address?.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.shipping_address?.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.shipping_address?.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.shipping_address?.address) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear dependent fields when parent selection changes
  const handleCountryChange = (country: string) => {
    if (formData.shipping_address?.country !== country) {
      onFormDataChange({
        ...formData,
        shipping_address: {
          country,
          state: '',
          city: '',
          address: formData.shipping_address?.address || ''
        }
      });
      clearState();
      clearCity();
    } else {
      onFormDataChange({
        ...formData,
        shipping_address: {
          country,
          state: formData.shipping_address?.state || '',
          city: formData.shipping_address?.city || '',
          address: formData.shipping_address?.address || ''
        }
      });
    }
  };

  const handleStateChange = (state: string) => {
    if (formData.shipping_address?.state !== state) {
      onFormDataChange({
        ...formData,
        shipping_address: {
          country: formData.shipping_address?.country || '',
          state,
          city: '',
          address: formData.shipping_address?.address || ''
        }
      });
      clearCity();
    } else {
      onFormDataChange({
        ...formData,
        shipping_address: {
          country: formData.shipping_address?.country || '',
          state,
          city: formData.shipping_address?.city || '',
          address: formData.shipping_address?.address || ''
        }
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const handleAddressChange = (field: string, value: string) => {
    onFormDataChange({
      ...formData,
      shipping_address: {
        country: formData.shipping_address?.country || '',
        state: formData.shipping_address?.state || '',
        city: formData.shipping_address?.city || '',
        address: formData.shipping_address?.address || '',
        [field]: value
      }
    });
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      onNext();
    }
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
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input"
                data-testid="shipping-form-name"
              />
              {errors.name && <FieldError message={errors.name} />}
            </div>
            <div>
              <label className="label">{t('email')} *</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input"
                data-testid="shipping-form-email"
              />
              {errors.email && <FieldError message={errors.email} />}
            </div>
          </div>

          <div>
            <label className="label">{t('phone')} *</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="input"
              data-testid="shipping-form-phone"
            />
            {errors.phone && <FieldError message={errors.phone} />}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormDropdown
              label={`${t('country')} *`}
              options={countries}
              value={formData.shipping_address?.country || ''}
              onChange={handleCountryChange}
              error={errors.country}
              placeholder={t('selectCountry')}
              dataTestId="shipping-form-country"
            />

            <FormDropdown
              label={`${t('state')} *`}
              options={availableStates}
              value={formData.shipping_address?.state || ''}
              onChange={handleStateChange}
              error={errors.state}
              placeholder={t('selectState')}
              disabled={!formData.shipping_address?.country}
              dataTestId="shipping-form-state"
            />

            <FormDropdown
              label={`${t('city')} *`}
              options={availableCities}
              value={formData.shipping_address?.city || ''}
              onChange={(city) => handleAddressChange('city', city)}
              error={errors.city}
              placeholder={t('selectCity')}
              disabled={!formData.shipping_address?.state}
              dataTestId="shipping-form-city"
            />
          </div>

          <div>
            <label className="label">{t('address')} *</label>
            <textarea
              value={formData.shipping_address?.address || ''}
              onChange={(e) => handleAddressChange('address', e.target.value)}
              rows={3}
              className="textarea"
              data-testid="shipping-form-address"
            />
            {errors.address && <FieldError message={errors.address} />}
          </div>

          <button
            type="button"
            onClick={handleFormSubmit}
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
            <strong>{t('name')}:</strong> {formData.name}
          </p>
          <p>
            <strong>{t('email')}:</strong> {formData.email}
          </p>
          <p>
            <strong>{t('phone')}:</strong> {formData.phone}
          </p>
          <p>
            <strong>{t('address')}:</strong> {formData.shipping_address?.address},{' '}
            {formData.shipping_address?.city}, {formData.shipping_address?.state},{' '}
            {formData.shipping_address?.country}
          </p>
        </div>
      )}
    </div>
  );
}
