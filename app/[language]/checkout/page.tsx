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
  const [
    paymentSettingsResult,
    cartResult,
    settingsResult,
    countriesResult,
    statesResult,
    citiesResult
  ] = await Promise.all([
    api.getPaymentSettings(),
    api.getCart(),
    api.getGlobalSettings(),
    api.getAllCountries(),
    api.getAllStates(),
    api.getAllCities()
  ]);

  if (
    paymentSettingsResult.isErr() ||
    cartResult.isErr() ||
    settingsResult.isErr() ||
    countriesResult.isErr() ||
    statesResult.isErr() ||
    citiesResult.isErr()
  ) {
    throw new Error('Failed to get data');
  }

  return (
    <CheckoutPage
      paymentSettings={paymentSettingsResult.value.data}
      cartResponse={cartResult.value.data}
      settings={settingsResult.value.data}
      countries={countriesResult.value.data.countries}
      states={statesResult.value.data.states}
      cities={citiesResult.value.data.cities}
    />
  );
}
