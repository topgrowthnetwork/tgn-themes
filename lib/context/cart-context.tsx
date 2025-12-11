'use client';

import { CartResponse } from 'lib/api/types';
import { useCart as useCartSWR } from 'lib/hooks/api';
import { createContext, ReactNode, useContext } from 'react';

interface CartContextType {
  cartResponse: CartResponse;
  currency: string;
  isLoading: boolean;
  mutate: () => Promise<any>;
}

const emptyCart: CartResponse = {
  cart: null,
  total_items: 0,
  sub_total: 0,
  tax: 0,
  total_price: 0,
  discount: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  currency
}: {
  children: ReactNode;
  currency: string;
}) {
  const { data, isLoading, mutate } = useCartSWR();

  const cartResponse = data ?? emptyCart;

  return (
    <CartContext.Provider value={{ cartResponse, currency, isLoading, mutate }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
