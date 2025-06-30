import { useEffect, useState } from 'react';

const SHIPPING_STORAGE_KEY = 'checkout_shipping_data';

interface ShippingData {
  name: string;
  email: string;
  phone: string;
  shipping_address: {
    country: string;
    state: string;
    city: string;
    address: string;
  };
}

export function useShippingStorage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Load shipping data from localStorage
  const loadShippingData = (): Partial<ShippingData> => {
    if (typeof window === 'undefined') return {};

    try {
      const stored = localStorage.getItem(SHIPPING_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load shipping data from localStorage:', error);
      return {};
    }
  };

  // Save shipping data to localStorage
  const saveShippingData = (data: ShippingData) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save shipping data to localStorage:', error);
    }
  };

  // Clear shipping data from localStorage
  const clearShippingData = () => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(SHIPPING_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear shipping data from localStorage:', error);
    }
  };

  // Initialize on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return {
    loadShippingData,
    saveShippingData,
    clearShippingData,
    isLoaded
  };
}
