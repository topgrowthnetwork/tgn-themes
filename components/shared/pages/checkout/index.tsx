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
import { useFormPersistence } from 'lib/hooks/use-form-persistence';
import { useShippingStorage } from 'lib/hooks/use-shipping-storage';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useFormState } from 'react-dom';

interface CheckoutPageProps {
  paymentSettings: PaymentSettings;
  cartResponse: CartResponse;
  settings: GlobalSettings;
  countries: Country[];
  states: State[];
  cities: City[];
}

// Constants
const STORAGE_KEY = 'checkout_shipping_data';
const INITIAL_FORM_DATA: Partial<CheckoutRequest> = {
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
};

export default function CheckoutPage({
  paymentSettings,
  cartResponse,
  settings,
  countries,
  states,
  cities
}: CheckoutPageProps) {
  const t = useTranslations('Checkout');
  const locale = useLocale();
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const { isLoaded } = useShippingStorage();

  const [formData, setFormData] = useState<Partial<CheckoutRequest>>(INITIAL_FORM_DATA);
  const [state, formAction] = useFormState(
    async (prevState: any, formData: FormData) => {
      return await processCheckout(prevState, formData, locale);
    },
    {
      message: '',
      success: false
    }
  );

  // Use form persistence hook
  const { saveStoredData } = useFormPersistence({
    storageKey: STORAGE_KEY,
    formData,
    reset: setFormData,
    isLoaded
  });

  // // Handle external payment gateway redirect
  // useEffect(() => {
  //   if (state?.success) {
  //     if (state.internalRedirect) {
  //       router.push('/thank-you');
  //     }
  //     if (state.redirectUrl) {
  //       window.location.href = state.redirectUrl;
  //     }
  //   }
  // }, [state, router]);

  const updateFormData = (field: keyof CheckoutRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShippingDataChange = (shippingData: Partial<CheckoutRequest>) => {
    setFormData((prev) => ({
      ...prev,
      ...shippingData
    }));
  };

  const handleNextStep = () => {
    saveStoredData(formData as CheckoutRequest);
    setStep('payment');
  };

  const handleBackToShipping = () => {
    setStep('shipping');
  };

  // Generate hidden form fields
  const renderHiddenFields = () => (
    <>
      <input type="hidden" name="name" value={formData.name || ''} />
      <input type="hidden" name="email" value={formData.email || ''} />
      <input type="hidden" name="phone" value={formData.phone || ''} />
      <input
        type="hidden"
        name="shipping_address_country"
        value={formData.shipping_address?.country || ''}
      />
      <input
        type="hidden"
        name="shipping_address_state"
        value={formData.shipping_address?.state || ''}
      />
      <input
        type="hidden"
        name="shipping_address_city"
        value={formData.shipping_address?.city || ''}
      />
      <input
        type="hidden"
        name="shipping_address_address"
        value={formData.shipping_address?.address || ''}
      />
      <input type="hidden" name="payment_gateway" value={formData.payment_gateway || ''} />
      {formData.wallet_number && (
        <input type="hidden" name="wallet_number" value={formData.wallet_number} />
      )}
      {formData.receipt_image && (
        <input type="hidden" name="receipt_image" value={formData.receipt_image} />
      )}
      {formData.coupon_code && (
        <input type="hidden" name="coupon_code" value={formData.coupon_code} />
      )}
    </>
  );

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>

        {state?.message && (
          <ToastNotification
            type={state.success ? 'success' : 'error'}
            message={state.message}
            autoClose={3000}
          />
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form action={formAction}>
              {renderHiddenFields()}

              <ShippingForm
                formData={formData}
                onFormDataChange={handleShippingDataChange}
                onNext={handleNextStep}
                isActive={step === 'shipping'}
                onEdit={handleBackToShipping}
                countries={countries}
                states={states}
                cities={cities}
              />

              {step === 'payment' && (
                <PaymentForm
                  formData={formData}
                  onFormDataChange={updateFormData}
                  paymentSettings={paymentSettings}
                  onBack={handleBackToShipping}
                />
              )}
            </form>
          </div>

          <div className="lg:col-span-1">
            <CartSummary cartResponse={cartResponse} currency={settings.site_global_currency} />
          </div>
        </div>
      </div>
    </Container>
  );
}
