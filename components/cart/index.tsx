import { createApi } from 'lib/api';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });
  const cartResponse = await api.getCart();

  return <CartModal cartResponse={cartResponse.data} />;
}
