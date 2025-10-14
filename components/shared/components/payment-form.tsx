'use client';

import LoadingDots from '@theme/components/loading-dots';
import clsx from 'clsx';
import { CheckoutRequest, PaymentSettings } from 'lib/api/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';

interface PaymentFormProps {
  formData: Partial<CheckoutRequest>;
  onFormDataChange: (field: keyof CheckoutRequest, value: any) => void;
  paymentSettings: PaymentSettings;
  onBack: () => void;
}

interface PaymentGateway {
  key: string;
  label: string;
  icon?: string;
}

export default function PaymentForm({
  formData,
  onFormDataChange,
  paymentSettings,
  onBack
}: PaymentFormProps) {
  const t = useTranslations('Checkout');
  const { pending } = useFormStatus();

  // Extract payment gateways configuration
  const getPaymentGateways = (): PaymentGateway[] => [
    { key: 'cash_on_delivery', label: t('cashOnDelivery') },
    { key: 'cash_on_site', label: t('cashOnSite') },
    {
      key: 'fawaterk_gateway',
      label: t('fawaterkGateway'),
      icon: '/images/gateways/fawaterk.jpeg'
    },
    { key: 'send_receipt', label: t('sendReceipt') },
    {
      key: 'paymob_card_gateway',
      label: t('paymobCardGateway'),
      icon: '/image/gateways/paymob.png'
    },
    {
      key: 'paymob_wallet_gateway',
      label: t('paymobWalletGateway'),
      icon: '/image/gateways/paymob.png'
    },
    { key: 'tabby_gateway', label: t('tabbyGateway'), icon: '/image/gateways/tabby.png' },
    { key: 'tamara_gateway', label: t('tamaraGateway'), icon: '/image/gateways/tamara.png' }
  ];

  const paymentGateways = getPaymentGateways().filter(
    (gateway) => paymentSettings[gateway.key as keyof PaymentSettings] === '1'
  );

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

  const renderActionButtons = () => (
    <div className="flex gap-x-4">
      <button type="button" onClick={onBack} className="button-secondary flex-1">
        {t('back')}
      </button>
      <button
        type="submit"
        disabled={pending}
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
