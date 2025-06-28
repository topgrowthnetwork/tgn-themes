import CheckoutPage from '@shared/pages/checkout';
import { createApi } from 'lib/api';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export const metadata = {
  title: 'Checkout',
  description: 'Complete your purchase and place your order.'
};

export default async function Page({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  // Fetch payment settings and cart data
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language, guestToken });
  const [paymentSettingsResult, cartResult, settingsResult] = await Promise.all([
    api.getPaymentSettings(),
    api.getCart(),
    api.getGlobalSettings()
  ]);

  if (paymentSettingsResult.isErr() || cartResult.isErr() || settingsResult.isErr()) {
    throw new Error('Failed to get payment settings');
  }

  const paymentSettings = paymentSettingsResult.value.data;
  const cartResponse = cartResult.value.data;
  const settings = settingsResult.value.data;

  return (
    <CheckoutPage
      paymentSettings={paymentSettings}
      cartResponse={cartResponse}
      settings={settings}
    />
  );
}
