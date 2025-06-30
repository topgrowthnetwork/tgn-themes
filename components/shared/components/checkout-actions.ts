'use server';

import { createApi } from 'lib/api';
import { ActionResponse, CheckoutRequest } from 'lib/api/types';
import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

interface CheckoutActionResponse extends ActionResponse {
  redirectUrl?: string;
  internalRedirect?: boolean;
}

export async function processCheckout(
  prevState: any,
  formData: FormData
): Promise<CheckoutActionResponse> {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  // Extract data from FormData
  const checkoutData: CheckoutRequest = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    shipping_address: {
      country: formData.get('shipping_address_country') as string,
      state: formData.get('shipping_address_state') as string,
      city: formData.get('shipping_address_city') as string,
      address: formData.get('shipping_address_address') as string
    },
    payment_gateway: formData.get('payment_gateway') as CheckoutRequest['payment_gateway'],
    coupon_code: (formData.get('coupon_code') as string) || undefined,
    receipt_image: (formData.get('receipt_image') as string) || undefined,
    wallet_number: (formData.get('wallet_number') as string) || undefined
  };

  const result = await api.checkout(checkoutData);

  if (result.isErr()) {
    return {
      message: `Checkout failed. ${result.error.message}`,
      success: false
    };
  }

  const { order, response } = result.value.data;
  revalidateTag(TAGS.cart);

  // Handle different payment gateways
  switch (order.payment_gateway) {
    case 'cash_on_site':
    case 'cash_on_delivery':
      // Redirect with language parameter since thank-you is under [language] route
      return {
        message: 'Redirecting to thank you page...',
        internalRedirect: true,
        success: true
      };
    case 'fawaterk_gateway':
    case 'paymob_card_gateway':
    case 'paymob_wallet_gateway':
      // Return the external payment URL for client-side redirect
      return {
        message: 'Redirecting to payment gateway...',
        redirectUrl: response,
        success: true
      };
    default:
      return {
        message: 'Unsupported payment method.',
        success: false
      };
  }
}
