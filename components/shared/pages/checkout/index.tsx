'use client';

import CartSummary from '@shared/components/cart-summary';
import { processCheckout } from '@shared/components/checkout-actions';
import PaymentForm from '@shared/components/payment-form';
import ShippingForm from '@shared/components/shipping-form';
import Container from '@theme/components/container';
import clsx from 'clsx';
import { CartResponse, CheckoutRequest, GlobalSettings, PaymentSettings } from 'lib/api/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useFormState } from 'react-dom';

interface CheckoutPageProps {
  paymentSettings: PaymentSettings;
  cartResponse: CartResponse;
  settings: GlobalSettings;
}

export default function CheckoutPage({
  paymentSettings,
  cartResponse,
  settings
}: CheckoutPageProps) {
  const t = useTranslations('Checkout');
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [formData, setFormData] = useState<Partial<CheckoutRequest>>({
    shipping_address: {
      country: '',
      state: '',
      city: '',
      address: ''
    },
    name: '',
    email: '',
    phone: '',
    payment_gateway: 'cash_on_delivery'
  });

  const [state, formAction] = useFormState(processCheckout, {
    success: false,
    message: '',
    error: null
  });

  const updateFormData = (field: keyof CheckoutRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShippingSubmit = (shippingData: any) => {
    // Update form data with shipping info
    setFormData((prev) => ({
      ...prev,
      ...shippingData
    }));
    setStep('payment');
  };

  const handleBackToShipping = () => {
    setStep('shipping');
  };

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>

        {/* Error/Success Message */}
        {state?.message && (
          <div
            className={clsx(
              'mb-4 rounded-md p-4',
              state?.success
                ? 'border border-green-200 bg-green-50 text-green-800'
                : 'border border-red-200 bg-red-50 text-red-800'
            )}
          >
            {state.message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Checkout Forms */}
          <div className="lg:col-span-2">
            {/* Shipping Form */}
            <ShippingForm
              formData={formData}
              onFormDataChange={handleShippingSubmit}
              onSubmit={() => setStep('payment')}
              isActive={step === 'shipping'}
              onEdit={handleBackToShipping}
            />

            {/* Payment Form */}
            {step === 'payment' && (
              <PaymentForm
                formData={formData}
                onFormDataChange={updateFormData}
                paymentSettings={paymentSettings}
                formAction={formAction}
                isSubmitting={state?.success}
                onBack={handleBackToShipping}
              />
            )}
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:col-span-1">
            <CartSummary cartResponse={cartResponse} currency={settings.site_global_currency} />
          </div>
        </div>
      </div>
    </Container>
  );
}
