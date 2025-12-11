'use client';

import { useGlobalSettings } from 'lib/hooks/api';
import { ReactNode } from 'react';
import { CartProvider } from './cart-context';

export default function CartProviderWrapper({ children }: { children: ReactNode }) {
  const { data: settings } = useGlobalSettings();
  const currency = settings?.site_global_currency || 'SAR';

  return <CartProvider currency={currency}>{children}</CartProvider>;
}
