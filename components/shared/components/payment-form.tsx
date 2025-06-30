'use client';

import { ButtonLoadingSpinner } from '@shared/components/loading-spinner';
import { CheckoutRequest, PaymentSettings } from 'lib/api/types';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FieldError from './field-error';

const paymentSchema = z.object({
  payment_gateway: z.string().min(1, 'Please select a payment method'),
  wallet_number: z.string().optional(),
  receipt_image: z.string().optional()
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  formData: Partial<CheckoutRequest>;
  onFormDataChange: (field: keyof CheckoutRequest, value: any) => void;
  paymentSettings: PaymentSettings;
  formAction: (formData: FormData) => void;
  isSubmitting?: boolean;
  onBack: () => void;
}

export default function PaymentForm({
  formData,
  onFormDataChange,
  paymentSettings,
  formAction,
  isSubmitting = false,
  onBack
}: PaymentFormProps) {
  const t = useTranslations('Checkout');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<PaymentFormData>({
    defaultValues: {
      payment_gateway: formData.payment_gateway || 'cash_on_delivery',
      wallet_number: formData.wallet_number || '',
      receipt_image: formData.receipt_image || ''
    }
  });

  const watchedPaymentGateway = watch('payment_gateway');

  const paymentGateways = [
    { key: 'cash_on_delivery', label: t('cashOnDelivery') },
    { key: 'cash_on_site', label: t('cashOnSite') },
    { key: 'fawaterk_gateway', label: t('fawaterkGateway') },
    { key: 'send_receipt', label: t('sendReceipt') },
    { key: 'paymob_card_gateway', label: t('paymobCardGateway') },
    { key: 'paymob_wallet_gateway', label: t('paymobWalletGateway') }
  ].filter((gateway) => paymentSettings[gateway.key as keyof PaymentSettings] === '1');

  const handleFormSubmit = (data: PaymentFormData) => {
    // Update form data with payment info
    onFormDataChange('payment_gateway', data.payment_gateway);
    if (data.wallet_number) {
      onFormDataChange('wallet_number', data.wallet_number);
    }
    if (data.receipt_image) {
      onFormDataChange('receipt_image', data.receipt_image);
    }

    // Create FormData for server action
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name || '');
    formDataToSubmit.append('email', formData.email || '');
    formDataToSubmit.append('phone', formData.phone || '');
    formDataToSubmit.append('shipping_address_country', formData.shipping_address?.country || '');
    formDataToSubmit.append('shipping_address_state', formData.shipping_address?.state || '');
    formDataToSubmit.append('shipping_address_city', formData.shipping_address?.city || '');
    formDataToSubmit.append('shipping_address_address', formData.shipping_address?.address || '');
    formDataToSubmit.append('payment_gateway', data.payment_gateway);

    if (data.wallet_number) {
      formDataToSubmit.append('wallet_number', data.wallet_number);
    }
    if (data.receipt_image) {
      formDataToSubmit.append('receipt_image', data.receipt_image);
    }
    if (formData.coupon_code) {
      formDataToSubmit.append('coupon_code', formData.coupon_code);
    }

    formAction(formDataToSubmit);
  };

  return (
    <div className="rounded-theme border border-gray-200 p-6">
      <h2 className="mb-4 text-xl font-semibold">{t('paymentMethod')}</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-3">
          {paymentGateways.map((gateway) => (
            <label
              key={gateway.key}
              className="flex cursor-pointer items-center gap-x-3 rounded-theme border border-gray-200 p-4 hover:bg-gray-50"
            >
              <input
                type="radio"
                value={gateway.key}
                {...register('payment_gateway')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium">{gateway.label}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.payment_gateway?.message} />

        {/* Optional fields based on payment method */}
        {watchedPaymentGateway === 'paymob_wallet_gateway' && (
          <div>
            <label className="label">{t('walletNumber')}</label>
            <input type="text" {...register('wallet_number')} className="input" />
            {errors.wallet_number && <FieldError message={errors.wallet_number.message} />}
          </div>
        )}

        {watchedPaymentGateway === 'send_receipt' && (
          <div>
            <label className="label">{t('receiptImage')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Handle file upload logic here
                  onFormDataChange('receipt_image', file.name);
                }
              }}
              className="input"
            />
            <FieldError message={errors.receipt_image?.message} />
          </div>
        )}

        <div className="flex gap-x-4">
          <button
            type="button"
            onClick={onBack}
            className="button flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            {t('back')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="button flex flex-1 items-center justify-center gap-2"
          >
            {isSubmitting && <ButtonLoadingSpinner />}
            {isSubmitting ? t('processing') : t('placeOrder')}
          </button>
        </div>
      </form>
    </div>
  );
}
