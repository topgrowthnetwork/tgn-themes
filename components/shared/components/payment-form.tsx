'use client';

import { ButtonLoadingSpinner } from '@shared/components/loading-spinner';
import clsx from 'clsx';
import { PaymentSettings } from 'lib/api/types';
import { useTranslations } from 'next-intl';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import FieldError from './field-error';

interface PaymentFormData {
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

interface PaymentFormProps {
  register: UseFormRegister<PaymentFormData>;
  control: Control<PaymentFormData>;
  errors: FieldErrors<PaymentFormData>;
  watch: UseFormWatch<PaymentFormData>;
  setValue: UseFormSetValue<PaymentFormData>;
  paymentSettings: PaymentSettings;
  onBack: () => void;
  isSubmitting: boolean;
  hasError: boolean;
}

export default function PaymentForm({
  register,
  control,
  errors,
  watch,
  setValue,
  paymentSettings,
  onBack,
  isSubmitting,
  hasError
}: PaymentFormProps) {
  const t = useTranslations('Checkout');

  const watchedPaymentGateway = watch('payment_gateway');

  const paymentGateways = [
    { key: 'cash_on_delivery', label: t('cashOnDelivery') },
    { key: 'cash_on_site', label: t('cashOnSite') },
    { key: 'fawaterk_gateway', label: t('fawaterkGateway') },
    { key: 'send_receipt', label: t('sendReceipt') },
    { key: 'paymob_card_gateway', label: t('paymobCardGateway') },
    { key: 'paymob_wallet_gateway', label: t('paymobWalletGateway') }
  ].filter((gateway) => paymentSettings[gateway.key as keyof PaymentSettings] === '1');

  return (
    <div className="rounded-theme border border-gray-200 p-6" data-testid="payment-form">
      <h2 className="mb-4 text-xl font-semibold">{t('paymentMethod')}</h2>

      <div className="space-y-4">
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
                className={clsx(
                  `paymentForm__radio ${gateway.key}`,
                  'h-4 w-4 text-primary-600 focus:ring-primary-500'
                )}
                data-testid={`payment-form-radio-${gateway.key}`}
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
                  setValue('receipt_image', file.name);
                }
              }}
              className="input"
            />
            <FieldError message={errors.receipt_image?.message} />
          </div>
        )}

        <div className="flex gap-x-4">
          <button type="button" onClick={onBack} className="button-secondary flex-1">
            {t('back')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="button flex flex-1 items-center justify-center gap-2"
            data-testid="payment-form-submit"
          >
            {isSubmitting && <ButtonLoadingSpinner />}
            {isSubmitting ? t('processing') : t('placeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}
