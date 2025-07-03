import { useEffect } from 'react';

interface FormPersistenceOptions<T> {
  storageKey: string;
  formData: Partial<T>;
  reset: (data: T) => void;
  isLoaded: boolean;
}

export function useFormPersistence<T>({
  storageKey,
  formData,
  reset,
  isLoaded
}: FormPersistenceOptions<T>) {
  // Load data from localStorage
  const loadStoredData = (): Partial<T> => {
    if (typeof window === 'undefined') return {};

    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn(`Failed to load data from localStorage for key "${storageKey}":`, error);
      return {};
    }
  };

  // Save data to localStorage
  const saveStoredData = (data: T) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save data to localStorage for key "${storageKey}":`, error);
    }
  };

  // Clear data from localStorage
  const clearStoredData = () => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn(`Failed to clear data from localStorage for key "${storageKey}":`, error);
    }
  };

  // Pre-fill form with stored data
  const prefillForm = () => {
    if (!isLoaded) return;

    const storedData = loadStoredData();
    if (Object.keys(storedData).length === 0) return;

    // Merge stored data with existing form data
    const mergedData = { ...formData, ...storedData };

    // Reset form with merged data
    reset(mergedData as T);
  };

  // Auto-prefill on mount and when dependencies change
  useEffect(() => {
    prefillForm();
  }, [isLoaded]);

  return {
    loadStoredData,
    saveStoredData,
    clearStoredData,
    prefillForm
  };
}
