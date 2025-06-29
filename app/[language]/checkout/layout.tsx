import EmptyCartMessage from '@shared/components/empty-cart-message';
import { createApi } from 'lib/api';
import { CartResponse } from 'lib/api/types';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';

export const runtime = 'edge';

interface CheckoutLayoutProps {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}

export default async function CheckoutLayout({ children, params }: CheckoutLayoutProps) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  // Fetch cart data to check if it's empty
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language, guestToken });
  const cartResult = await api.getCart();

  if (cartResult.isErr()) {
    throw new Error('Failed to get cart data');
  }

  const cartResponse: CartResponse = cartResult.value.data;

  // Check if cart is empty
  const isCartEmpty = !cartResponse.cart || cartResponse.total_items === 0;

  if (isCartEmpty) {
    return <EmptyCartMessage language={language} />;
  }

  return <>{children}</>;
}
