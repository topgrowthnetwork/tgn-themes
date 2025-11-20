'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface ShippingContextType {
  shippingAmount: number;
  selectedStateName: string;
  setShipping: (amount: number, stateName: string) => void;
  clearShipping: () => void;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [shippingAmount, setShippingAmount] = useState<number>(0);
  const [selectedStateName, setSelectedStateName] = useState<string>('');

  const setShipping = (amount: number, stateName: string) => {
    setShippingAmount(amount);
    setSelectedStateName(stateName);
  };

  const clearShipping = () => {
    setShippingAmount(0);
    setSelectedStateName('');
  };

  return (
    <ShippingContext.Provider
      value={{
        shippingAmount,
        selectedStateName,
        setShipping,
        clearShipping
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
