'use client';

import clsx from 'clsx';
import { CheckoutRequest, City, Country, State } from 'lib/api/types';
import { useShipping } from 'lib/context/shipping-context';
import { useAddressCascade } from 'lib/hooks/use-address-cascade';
import { shippingStepSchema } from 'lib/validation/checkout';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { z } from 'zod';
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
  const { setShipping, clearShipping } = useShipping();

  // Use custom hook for address cascade logic
  const { availableStates, availableCities, clearState, clearCity } = useAddressCascade({
    countries,
    states,
    cities,
    selectedCountry: formData.shipping_address?.country || '',
    selectedState: formData.shipping_address?.state || ''
  });

  // Auto-set country to first in array if not already set
  useEffect(() => {
    if (!formData.shipping_address?.country && countries.length > 0) {
      onFormDataChange({
        ...formData,
        shipping_address: {
          country: countries[0].name,
          state: '',
          city: '',
          address: formData.shipping_address?.address || ''
        }
      });
    }
  }, [countries]);

  // Sync shipping context when state changes (including from localStorage)
  useEffect(() => {
    const currentState = formData.shipping_address?.state;

    if (currentState && states.length > 0) {
      // Find the matching state and update shipping context
      const selectedState = states.find((s) => s.name === currentState);
      if (selectedState) {
        setShipping(selectedState.shipping_amount, selectedState.name);
      } else {
        // State not found in available states, clear shipping
        clearShipping();
      }
    } else {
      // No state selected, clear shipping
      clearShipping();
    }
  }, [formData.shipping_address?.state, states, setShipping, clearShipping]);

  // Validation using Zod - only validates shipping step fields
  const validateForm = (): boolean => {
    try {
      // Prepare data for validation - only shipping step fields
      const dataToValidate = {
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        shipping_address: {
          country: formData.shipping_address?.country || '',
          state: formData.shipping_address?.state || '',
          city: formData.shipping_address?.city || '',
          address: formData.shipping_address?.address || ''
        }
      };

      // Validate with Zod
      shippingStepSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Event handlers
  const handleCountryChange = (country: string) => {
    const isCountryChanged = formData.shipping_address?.country !== country;

    onFormDataChange({
      ...formData,
      shipping_address: {
        country,
        state: isCountryChanged ? '' : formData.shipping_address?.state || '',
        city: isCountryChanged ? '' : formData.shipping_address?.city || '',
        address: formData.shipping_address?.address || ''
      }
    });

    if (isCountryChanged) {
      clearState();
      clearCity();
    }
  };

  const handleStateChange = (state: string) => {
    const isStateChanged = formData.shipping_address?.state !== state;

    onFormDataChange({
      ...formData,
      shipping_address: {
        country: formData.shipping_address?.country || '',
        state,
        city: isStateChanged ? '' : formData.shipping_address?.city || '',
        address: formData.shipping_address?.address || ''
      }
    });

    if (isStateChanged) {
      clearCity();
    }

    // Update shipping amount in context
    const selectedState = states.find((s) => s.name === state);
    if (selectedState) {
      setShipping(selectedState.shipping_amount, selectedState.name);
    } else {
      clearShipping();
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

  // Helper function to get error for a field
  const getFieldError = (fieldPath: string): string | undefined => {
    return errors[fieldPath];
  };

  // Render functions
  const renderPersonalInfoFields = () => (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="shipping-name" className="label">
            {t('name')} *
          </label>
          <input
            id="shipping-name"
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="input"
            data-testid="shipping-form-name"
          />
          {getFieldError('name') && <FieldError message={getFieldError('name')!} />}
        </div>
        <div>
          <label htmlFor="shipping-email" className="label">
            {t('email')} *
          </label>
          <input
            id="shipping-email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="input"
            data-testid="shipping-form-email"
          />
          {getFieldError('email') && <FieldError message={getFieldError('email')!} />}
        </div>
      </div>

      <div>
        <label htmlFor="shipping-phone" className="label">
          {t('phone')} *
        </label>
        <input
          id="shipping-phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="input"
          data-testid="shipping-form-phone"
        />
        {getFieldError('phone') && <FieldError message={getFieldError('phone')!} />}
      </div>
    </>
  );

  const renderAddressFields = () => (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormDropdown
          id="shipping-state"
          label={`${t('state')} *`}
          options={availableStates}
          value={formData.shipping_address?.state || ''}
          onChange={handleStateChange}
          error={getFieldError('shipping_address.state')}
          placeholder={t('selectState')}
          disabled={!formData.shipping_address?.country}
          dataTestId="shipping-form-state"
        />

        <FormDropdown
          id="shipping-city"
          label={`${t('city')} *`}
          options={availableCities}
          value={formData.shipping_address?.city || ''}
          onChange={(city) => handleAddressChange('city', city)}
          error={getFieldError('shipping_address.city')}
          placeholder={t('selectCity')}
          disabled={!formData.shipping_address?.state}
          dataTestId="shipping-form-city"
        />
      </div>

      <div>
        <label htmlFor="shipping-address" className="label">
          {t('address')} *
        </label>
        <textarea
          id="shipping-address"
          value={formData.shipping_address?.address || ''}
          onChange={(e) => handleAddressChange('address', e.target.value)}
          rows={3}
          className="textarea"
          data-testid="shipping-form-address"
        />
        {getFieldError('shipping_address.address') && (
          <FieldError message={getFieldError('shipping_address.address')!} />
        )}
      </div>
    </>
  );

  const renderSummary = () => (
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
  );

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

      {isActive ? (
        <div className="space-y-4">
          {renderPersonalInfoFields()}
          {renderAddressFields()}
          <button
            type="button"
            onClick={handleFormSubmit}
            className="button"
            data-testid="shipping-form-submit"
          >
            {t('next')}
          </button>
        </div>
      ) : (
        renderSummary()
      )}
    </div>
  );
}
