'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { CheckoutRequest } from 'lib/api/types';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FieldError from './field-error';

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
}

export default function ShippingForm({
  formData,
  onFormDataChange,
  onSubmit,
  isActive,
  onEdit
}: ShippingFormProps) {
  const t = useTranslations('Checkout');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
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

  const watchedValues = watch();

  const handleFormSubmit = (data: ShippingFormData) => {
    onFormDataChange(data);
    onSubmit();
  };

  return (
    <div
      className={clsx(
        'mb-8 rounded-lg border p-6',
        isActive ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('shippingAddress')}</h2>
        {!isActive && onEdit && (
          <button onClick={onEdit} className="form-button-secondary">
            {t('edit')}
          </button>
        )}
      </div>

      {isActive && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">{t('name')} *</label>
              <input type="text" {...register('name')} className="form-input" />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <label className="form-label">{t('email')} *</label>
              <input type="email" {...register('email')} className="form-input" />
              <FieldError message={errors.email?.message} />
            </div>
          </div>

          <div>
            <label className="form-label">{t('phone')} *</label>
            <input type="tel" {...register('phone')} className="form-input" />
            <FieldError message={errors.phone?.message} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="form-label">{t('country')} *</label>
              <input type="text" {...register('shipping_address.country')} className="form-input" />
              <FieldError message={errors.shipping_address?.country?.message} />
            </div>
            <div>
              <label className="form-label">{t('state')} *</label>
              <input type="text" {...register('shipping_address.state')} className="form-input" />
              <FieldError message={errors.shipping_address?.state?.message} />
            </div>
            <div>
              <label className="form-label">{t('city')} *</label>
              <input type="text" {...register('shipping_address.city')} className="form-input" />
              <FieldError message={errors.shipping_address?.city?.message} />
            </div>
          </div>

          <div>
            <label className="form-label">{t('address')} *</label>
            <textarea
              {...register('shipping_address.address')}
              rows={3}
              className="form-textarea"
            />
            <FieldError message={errors.shipping_address?.address?.message} />
          </div>

          <button type="submit" className="form-button">
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
