'use client';

import { CartResponse } from 'lib/api/types';
import { createContext, ReactNode, useContext, useState } from 'react';

interface CartContextType {
  cartResponse: CartResponse;
  setCartResponse: (cart: CartResponse) => void;
  currency: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  initialCart,
  currency
}: {
  children: ReactNode;
  initialCart: CartResponse;
  currency: string;
}) {
  const [cartResponse, setCartResponse] = useState<CartResponse>(initialCart);

  return (
    <CartContext.Provider value={{ cartResponse, setCartResponse, currency }}>
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
