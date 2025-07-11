import { createApi } from 'lib/api';
import { CartResponse } from 'lib/api/types';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const locale = await getLocale();

  const cartResponse = await (async function getCartResponse() {
    const emptyCart: CartResponse = {
      cart: null,
      total_items: 0,
      sub_total: 0,
      tax: 0,
      total_price: 0,
      discount: 0
    };

    const guestToken = cookies().get('guest_token')?.value;
    if (!guestToken) {
      return emptyCart;
    }

    const api = createApi({ language: locale, guestToken });
    const cartResult = await api.getCart();

    if (cartResult.isErr()) {
      return emptyCart;
    }

    return cartResult.value.data;
  })();

  const api = createApi({ language: locale });
  const settingsResult = await api.getGlobalSettings();

  if (settingsResult.isErr()) {
    return null;
  }

  return (
    <CartModal
      cartResponse={cartResponse}
      currency={settingsResult.value.data.site_global_currency}
    />
  );
}
