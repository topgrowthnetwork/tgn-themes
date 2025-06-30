'use server';

import { createApi } from 'lib/api';
import { CheckoutRequest } from 'lib/api/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function processCheckout(prevState: any, formData: FormData) {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
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
        success: false,
        message: 'Checkout failed. Please try again.',
        error: result.error
      };
    }

    const { order, response } = result.value.data;

    // Handle different payment gateways
    switch (order.payment_gateway) {
      case 'cash_on_site':
      case 'cash_on_delivery':
        redirect('/thank-you');
      case 'fawaterk_gateway':
      case 'paymob_card_gateway':
      case 'paymob_wallet_gateway':
        // Return the external payment URL for client-side redirect
        return {
          success: true,
          message: 'Redirecting to payment gateway...',
          redirectUrl: response,
          order
        };
      default:
        return {
          success: false,
          message: 'Unsupported payment method.',
          error: 'Unsupported payment method'
        };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error.message
    };
  }
}
