import { createApi } from 'lib/api';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });
  const cartResult = await api.getCart();

  if (cartResult.isErr()) {
    return null;
  }

  return <CartModal cartResponse={cartResult.value.data} />;
}
