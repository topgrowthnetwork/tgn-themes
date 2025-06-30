'use client';

import CartSummary from '@shared/components/cart-summary';
import { processCheckout } from '@shared/components/checkout-actions';
import PaymentForm from '@shared/components/payment-form';
import ShippingForm from '@shared/components/shipping-form';
import { ToastNotification } from '@shared/components/toast-notification';
import Container from '@theme/components/container';
import {
  CartResponse,
  CheckoutRequest,
  City,
  Country,
  GlobalSettings,
  PaymentSettings,
  State
} from 'lib/api/types';
import { getNotificationData } from 'lib/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

interface CheckoutPageProps {
  paymentSettings: PaymentSettings;
  cartResponse: CartResponse;
  settings: GlobalSettings;
  countries: Country[];
  states: State[];
  cities: City[];
}

export default function CheckoutPage({
  paymentSettings,
  cartResponse,
  settings,
  countries,
  states,
  cities
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

  const [state, formAction] = useFormState(processCheckout, null);

  // Handle external payment gateway redirect
  useEffect(() => {
    if (state?.isOk() && state.value.redirectUrl) {
      // Redirect to external payment gateway
      window.location.href = state.value.redirectUrl;
    }
  }, [state]);

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

        {/* Toast Notification */}
        <ToastNotification {...getNotificationData(state)} autoClose={3000} />

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
              countries={countries}
              states={states}
              cities={cities}
            />

            {/* Payment Form */}
            {step === 'payment' && (
              <PaymentForm
                formData={formData}
                onFormDataChange={updateFormData}
                paymentSettings={paymentSettings}
                formAction={formAction}
                isSubmitting={state?.isOk()}
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
