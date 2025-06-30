'use client';

import CartSummary from '@shared/components/cart-summary';
import { processCheckout } from '@shared/components/checkout-actions';
import PaymentForm from '@shared/components/payment-form';
import ShippingForm from '@shared/components/shipping-form';
import { ToastNotification } from '@shared/components/toast-notification';
import Container from '@theme/components/container';
import { CartResponse, City, Country, GlobalSettings, PaymentSettings, State } from 'lib/api/types';
import { useShippingStorage } from 'lib/hooks/use-shipping-storage';
import { useRouter } from 'lib/i18n/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Combined schema for the entire checkout form
const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone is required'),
  shipping_address: z.object({
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    address: z.string().min(1, 'Address is required')
  }),
  payment_gateway: z.string().min(1, 'Please select a payment method'),
  wallet_number: z.string().optional(),
  receipt_image: z.string().optional(),
  coupon_code: z.string().optional()
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutPageProps {
  paymentSettings: PaymentSettings;
  cartResponse: CartResponse;
  settings: GlobalSettings;
  countries: Country[];
  states: State[];
  cities: City[];
}

// Form persistence utilities
const loadStoredData = (storageKey: string): Partial<CheckoutFormData> => {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn(`Failed to load data from localStorage for key "${storageKey}":`, error);
    return {};
  }
};

const saveStoredData = (storageKey: string, data: Partial<CheckoutFormData>) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.warn(`Failed to save data to localStorage for key "${storageKey}":`, error);
  }
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
  const router = useRouter();
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoaded } = useShippingStorage();

  // Load stored data for initial form values
  const getInitialFormData = (): CheckoutFormData => {
    const storedData = loadStoredData('checkout_shipping_data');
    return {
      name: storedData.name || '',
      email: storedData.email || '',
      phone: storedData.phone || '',
      shipping_address: {
        country: storedData.shipping_address?.country || '',
        state: storedData.shipping_address?.state || '',
        city: storedData.shipping_address?.city || '',
        address: storedData.shipping_address?.address || ''
      },
      payment_gateway: storedData.payment_gateway || 'cash_on_delivery',
      wallet_number: storedData.wallet_number || '',
      receipt_image: storedData.receipt_image || '',
      coupon_code: storedData.coupon_code || ''
    };
  };

  // Single form instance for the entire checkout
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: getInitialFormData(),
    mode: 'onChange'
  });

  const [state, formAction] = useFormState(processCheckout, {
    message: '',
    success: false
  });

  // Load stored data when component mounts
  useEffect(() => {
    if (isLoaded) {
      const storedData = loadStoredData('checkout_shipping_data');
      if (Object.keys(storedData).length > 0) {
        reset(getInitialFormData());
      }
    }
  }, [isLoaded, reset]);

  // Handle external payment gateway redirect
  useEffect(() => {
    if (state?.success) {
      setIsSubmitting(false);
      // Redirect to external payment gateway
      if (state.internalRedirect) {
        router.push('/thank-you');
      }
      if (state.redirectUrl) {
        window.location.href = state.redirectUrl;
      }
    }
  }, [state, router]);

  // Handle form submission errors
  useEffect(() => {
    if (state?.message && !state?.success) {
      setIsSubmitting(false);
    }
  }, [state]);

  const handleNextStep = () => {
    // Save current form data to localStorage before moving to next step
    const currentData = watch();
    saveStoredData('checkout_shipping_data', currentData);
    setStep('payment');
  };

  const handleBackToShipping = () => {
    setStep('shipping');
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    // Create FormData for server action
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', data.name);
    formDataToSubmit.append('email', data.email);
    formDataToSubmit.append('phone', data.phone);
    formDataToSubmit.append('shipping_address_country', data.shipping_address.country);
    formDataToSubmit.append('shipping_address_state', data.shipping_address.state);
    formDataToSubmit.append('shipping_address_city', data.shipping_address.city);
    formDataToSubmit.append('shipping_address_address', data.shipping_address.address);
    formDataToSubmit.append('payment_gateway', data.payment_gateway);

    if (data.wallet_number) {
      formDataToSubmit.append('wallet_number', data.wallet_number);
    }
    if (data.receipt_image) {
      formDataToSubmit.append('receipt_image', data.receipt_image);
    }
    if (data.coupon_code) {
      formDataToSubmit.append('coupon_code', data.coupon_code);
    }

    formAction(formDataToSubmit);
  };

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>

        {/* Toast Notification */}
        {state?.message && (
          <ToastNotification
            type={state.success ? 'success' : 'error'}
            message={state.message}
            autoClose={3000}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Checkout Forms */}
            <div className="lg:col-span-2">
              {/* Shipping Form */}
              <ShippingForm
                register={register}
                control={control}
                errors={errors}
                watch={watch}
                setValue={setValue}
                onNext={handleNextStep}
                isActive={step === 'shipping'}
                onEdit={handleBackToShipping}
                countries={countries}
                states={states}
                cities={cities}
              />

              {/* Payment Form */}
              {step === 'payment' && (
                <PaymentForm
                  register={register}
                  control={control}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  paymentSettings={paymentSettings}
                  onBack={handleBackToShipping}
                  isSubmitting={isSubmitting}
                  hasError={Boolean(state?.message && !state?.success)}
                />
              )}
            </div>

            {/* Cart Summary Sidebar */}
            <div className="lg:col-span-1">
              <CartSummary cartResponse={cartResponse} currency={settings.site_global_currency} />
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
}
