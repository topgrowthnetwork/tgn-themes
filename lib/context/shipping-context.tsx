'use client';

import { createApi } from 'lib/api';
import { useLocale } from 'next-intl';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useCart } from './cart-context';

interface ShippingContextType {
  shippingAmount: number;
  selectedStateName: string;
  setShipping: (amount: number, stateName: string) => void;
  clearShipping: () => void;
  fetchShipping: (
    cityCode: string,
    stateCode: string,
    address: string,
    lat?: number,
    lng?: number
  ) => Promise<void>;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [shippingAmount, setShippingAmount] = useState<number>(0);
  const [selectedStateName, setSelectedStateName] = useState<string>('');
  const [cookies] = useCookies(['guest_token']);
  const locale = useLocale();

  // Get cart context - ShippingProvider should be inside CartProvider
  const { setCartResponse } = useCart();

  const setShipping = (amount: number, stateName: string) => {
    setShippingAmount(amount);
    setSelectedStateName(stateName);
  };

  const clearShipping = () => {
    setShippingAmount(0);
    setSelectedStateName('');
  };

  const fetchShipping = async (
    cityCode: string,
    stateCode: string,
    address: string,
    lat?: number,
    lng?: number
  ) => {
    const guestToken = cookies.guest_token;
    if (!guestToken) return;

    const api = createApi({ language: locale, guestToken });
    const result = await api.getCart({
      city: cityCode,
      state: stateCode,
      address,
      lat,
      lng
    });

    if (result.isOk()) {
      const cartData = result.value.data;
      if (cartData.shipping_amount !== undefined) {
        setShippingAmount(cartData.shipping_amount);
      }
      setCartResponse(cartData);
    }
  };

  return (
    <ShippingContext.Provider
      value={{
        shippingAmount,
        selectedStateName,
        setShipping,
        clearShipping,
        fetchShipping
      }}
    >
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const context = useContext(ShippingContext);
  if (context === undefined) {
    throw new Error('useShipping must be used within a ShippingProvider');
  }
  return context;
}
