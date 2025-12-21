'use client';

import LoadingDots from '@theme/components/loading-dots';
import clsx from 'clsx';
import { CheckoutRequest, PaymentSettings } from 'lib/api/types';
import { useCart } from 'lib/context/cart-context';
import { getAllPaymentGateways } from 'lib/payment-gateways';
import { checkTabbyAvailability } from 'lib/tabby/client';
import { paymentInfoSchema } from 'lib/validation/checkout';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';
import FieldError from './field-error';

interface PaymentFormProps {
  formData: Partial<CheckoutRequest>;
  onFormDataChange: (field: keyof CheckoutRequest, value: any) => void;
  paymentSettings: PaymentSettings;
  onBack: () => void;
}

export default function PaymentForm({
  formData,
  onFormDataChange,
  paymentSettings,
  onBack
}: PaymentFormProps) {
  const t = useTranslations('Checkout');
  const locale = useLocale();
  const { pending } = useFormStatus();
  const { cartResponse, currency } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTabbyAvailable, setIsTabbyAvailable] = useState<boolean | null>(null);

  // Check Tabby availability when shipping address is available
  useEffect(() => {
    const checkTabby = async () => {
      const isAvailable = await checkTabbyAvailability(cartResponse, formData, currency, locale);
      console.log('Tabby availability:', isAvailable);
      setIsTabbyAvailable(isAvailable);
    };

    if (paymentSettings.tabby_gateway === '1') {
      checkTabby();
    } else {
      setIsTabbyAvailable(false);
    }
  }, [cartResponse, formData, currency, locale, paymentSettings.tabby_gateway]);

  // Get payment gateways configuration from shared config
  const gatewayConfigs = getAllPaymentGateways();

  const paymentGateways = gatewayConfigs
    .filter((gateway) => {
      const isEnabled = paymentSettings[gateway.key as keyof PaymentSettings] === '1';
      // For Tabby, also check if installments are available
      if (gateway.key === 'tabby_gateway') {
        return isEnabled && isTabbyAvailable === true;
      }
      return isEnabled;
    })
    .map((gateway) => ({
      key: gateway.key,
      label: t(gateway.key as any),
      icon: gateway.faviconPath
    }));

  // Validation using Zod - validates payment step fields
  const validateForm = (): boolean => {
    try {
      const dataToValidate = {
        payment_gateway: formData.payment_gateway || '',
        coupon_code: formData.coupon_code,
        receipt_image: formData.receipt_image,
        wallet_number: formData.wallet_number
      };

      paymentInfoSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
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

  const handlePaymentGatewayChange = (gateway: string) => {
    onFormDataChange('payment_gateway', gateway);
  };

  const handleWalletNumberChange = (value: string) => {
    onFormDataChange('wallet_number', value);
  };

  const handleReceiptImageChange = (file: File) => {
    onFormDataChange('receipt_image', file.name);
  };

  const renderPaymentGatewayOptions = () => (
    <>
      <div className="space-y-3">
        {paymentGateways.map((gateway) => (
          <label
            key={gateway.key}
            className="flex cursor-pointer items-center gap-x-3 rounded-theme border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <input
              type="radio"
              name="payment_gateway"
              value={gateway.key}
              checked={formData.payment_gateway === gateway.key}
              onChange={() => handlePaymentGatewayChange(gateway.key)}
              className={clsx(
                `paymentForm__radio ${gateway.key}`,
                'h-4 w-4 text-primary-600 focus:ring-primary-500'
              )}
              data-testid={`payment-form-radio-${gateway.key}`}
            />
            <div className="flex items-center gap-x-2">
              {gateway.icon && (
                <div className="relative h-5 w-5 flex-shrink-0">
                  <Image
                    src={gateway.icon}
                    alt={gateway.label}
                    fill
                    className="object-contain"
                    sizes="20px"
                  />
                </div>
              )}
              <span className="text-sm font-medium dark:text-white">{gateway.label}</span>
            </div>
          </label>
        ))}
      </div>
      {errors.payment_gateway && <FieldError message={errors.payment_gateway} />}
    </>
  );

  const renderWalletNumberField = () => {
    if (formData.payment_gateway !== 'paymob_wallet_gateway') return null;

    return (
      <div>
        <label htmlFor="payment-wallet-number" className="label">
          {t('walletNumber')}
        </label>
        <input
          id="payment-wallet-number"
          type="text"
          name="wallet_number"
          value={formData.wallet_number || ''}
          onChange={(e) => handleWalletNumberChange(e.target.value)}
          className="input"
        />
      </div>
    );
  };

  const renderReceiptImageField = () => {
    if (formData.payment_gateway !== 'send_receipt') return null;

    return (
      <div>
        <label htmlFor="payment-receipt-image" className="label">
          {t('receiptImage')}
        </label>
        <input
          id="payment-receipt-image"
          type="file"
          name="receipt_image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleReceiptImageChange(file);
            }
          }}
          className="input"
        />
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!validateForm()) {
      e.preventDefault();
    }
  };

  const renderActionButtons = () => (
    <div className="flex gap-x-4">
      <button type="button" onClick={onBack} className="button-secondary flex-1">
        {t('back')}
      </button>
      <button
        type="submit"
        disabled={pending}
        onClick={handleSubmit}
        className="button flex flex-1 items-center justify-center gap-2"
        data-testid="payment-form-submit"
      >
        {pending && <LoadingDots className="bg-white dark:bg-gray-800" />}
        {pending ? t('processing') : t('placeOrder')}
      </button>
    </div>
  );

  return (
    <div
      className="rounded-theme border border-gray-200 p-6 dark:border-gray-700 dark:bg-gray-800"
      data-testid="payment-form"
    >
      <h2 className="mb-4 text-xl font-semibold dark:text-white">{t('paymentMethod')}</h2>

      <div className="space-y-4">
        {renderPaymentGatewayOptions()}
        {renderWalletNumberField()}
        {renderReceiptImageField()}
        {renderActionButtons()}
      </div>
    </div>
  );
}
