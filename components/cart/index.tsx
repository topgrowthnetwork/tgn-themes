import { createApi } from 'lib/api';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const locale = await getLocale();
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: locale, guestToken });
  const cartResult = await api.getCart();

  if (cartResult.isErr()) {
    return null;
  }

  return <CartModal cartResponse={cartResult.value.data} />;
}
