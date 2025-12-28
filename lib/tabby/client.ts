'use server';

import { CartResponse, CheckoutRequest } from 'lib/api/types';

const TABBY_API_URL = 'https://api.tabby.ai/api/v2/checkout';
const TABBY_PUBLIC_KEY = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY;
const TABBY_MERCHANT_CODE = process.env.NEXT_PUBLIC_TABBY_MERCHANT_CODE;

export interface TabbyCheckoutResponse {
  configuration: {
    available_products?: {
      installments?: Array<{
        web_url: string;
      }>;
    };
  };
}

interface TabbyCheckoutRequest {
  payment: {
    amount: string;
    currency: string;
    buyer: {
      phone: string;
      email: string;
      name: string;
    };
    order: {
      reference_id: string;
      items: Array<{
        title: string;
        quantity: number;
        unit_price: string;
        category: string;
      }>;
    };
    shipping_address: {
      city: string;
      address: string;
      zip: string;
    };
  };
  lang: string;
  merchant_code: string;
}

export async function checkTabbyAvailability(
  cart: CartResponse,
  formData: Partial<CheckoutRequest>,
  currency: string,
  language: string = 'en'
): Promise<boolean> {
  if (!TABBY_PUBLIC_KEY || !TABBY_MERCHANT_CODE || !cart.cart) {
    return false;
  }

  const request: TabbyCheckoutRequest = {
    payment: {
      amount: cart.total_price.toString(),
      currency,
      buyer: {
        phone: formData.phone || '',
        email: formData.email || '',
        name: formData.name || ''
      },
      order: {
        reference_id: cart.cart.id.toString(),
        items: cart.cart.cart_items.map((item) => ({
          title: item.product.title,
          quantity: item.qty,
          unit_price: (item.variant?.final_price ?? item.product.final_price).toString(),
          category: 'General'
        }))
      },
      shipping_address: {
        city: formData.shipping_address?.city || '',
        address: formData.shipping_address?.address || '',
        zip: '00000'
      }
    },
    lang: language,
    merchant_code: TABBY_MERCHANT_CODE
  };

  try {
    const response = await fetch(TABBY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TABBY_PUBLIC_KEY}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      return false;
    }

    const data: TabbyCheckoutResponse = await response.json();

    console.log(data);
    const installments = data.configuration?.available_products?.installments;

    return Array.isArray(installments) && installments.length > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}
