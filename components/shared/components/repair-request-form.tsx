'use client';

import FieldError from '@shared/components/field-error';
import FormDropdown from '@shared/components/form-dropdown';
import { submitRepairRequest } from '@shared/components/repair-request-actions';
import { ToastNotification } from '@shared/components/toast-notification';
import LoadingDots from '@theme/components/loading-dots';
import { createApi } from 'lib/api';
import { Category } from 'lib/api/types';
import { repairRequestFormSchema } from 'lib/validation/repair-request';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import useSWR from 'swr';
import { z } from 'zod';

function SubmitButton() {
  const t = useTranslations('RepairRequest');
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="button flex items-center justify-center gap-2"
    >
      {pending && <LoadingDots className="bg-white dark:bg-gray-800" />}
      {pending ? t('sending') : t('sendMessage')}
    </button>
  );
}

interface RepairRequestFormProps {
  categories: Category[];
}

export default function RepairRequestForm({ categories }: RepairRequestFormProps) {
  const t = useTranslations('RepairRequest');
  const locale = useLocale();
  const [state, formAction] = useFormState(submitRepairRequest, {
    message: '',
    success: false
  });

  // Check if email is optional
  const isEmailOptional = process.env.NEXT_PUBLIC_CONTACT_EMAIL_OPTIONAL === 'true';

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const stateInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);

  // Parse states from environment variables
  const states = useMemo(() => {
    const statesString = process.env.NEXT_PUBLIC_REPAIR_REQUEST_STATES || '';
    return statesString.split(',').map((state, index) => ({
      id: index + 1,
      name: state.trim()
    }));
  }, []);

  // Convert categories to dropdown options
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      name: category.name
    }));
  }, [categories]);

  // Get selected category object
  const selectedCategoryObj = useMemo(() => {
    return categories.find((cat) => cat.name === selectedCategory);
  }, [selectedCategory, categories]);

  // SWR fetcher function
  const fetcher = async (url: string) => {
    const api = createApi({ language: locale });
    const result = await api.getProducts({ category: url });
    if (result.isOk()) {
      return result.value.data.products.data;
    }
    throw new Error('Failed to fetch products');
  };

  // Use SWR to fetch products
  const {
    data: products = [],
    error: productsError,
    isLoading: loadingProducts
  } = useSWR(selectedCategoryObj ? selectedCategoryObj.id.toString() : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000 // Cache for 1 minute
  });

  // Convert products to dropdown options
  const productOptions = useMemo(() => {
    return products.map((product) => ({
      id: product.id,
      name: product.title
    }));
  }, [products]);

  // Reset product selection when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSelectedProduct('');
    }
  }, [selectedCategory]);

  // Reset form when successful
  useEffect(() => {
    if (state?.success) {
      setErrors({});
      setSelectedState('');
      setSelectedCategory('');
      setSelectedProduct('');
      formRef.current?.reset();
    }
  }, [state?.success]);

  // Update hidden inputs when dropdowns change
  useEffect(() => {
    if (stateInputRef.current) {
      stateInputRef.current.value = selectedState;
    }
  }, [selectedState]);

  useEffect(() => {
    if (categoryInputRef.current) {
      categoryInputRef.current.value = selectedCategory;
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (productInputRef.current) {
      productInputRef.current.value = selectedProduct;
    }
  }, [selectedProduct]);

  // Client-side validation using Zod
  const validateForm = (formData: FormData): boolean => {
    try {
      // Prepare data for validation
      const dataToValidate = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        state: formData.get('state') as string,
        category: formData.get('category') as string,
        product: formData.get('product') as string,
        message: formData.get('message') as string
      };

      // Validate with Zod
      repairRequestFormSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (formData: FormData) => {
    if (validateForm(formData)) {
      return formAction(formData);
    }
    return null;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {t('sendMessage')}
      </h2>
      <ToastNotification
        type={state.success ? 'success' : 'error'}
        message={state.message}
        autoClose={state.success ? 5000 : false}
      />

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="form-label">
              {t('name')}
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder={t('namePlaceholder')}
              className="input"
            />
            {errors.name && <FieldError message={errors.name} />}
          </div>

          <div>
            <label htmlFor="contact-email" className="form-label">
              {t('email')}
              {isEmailOptional && (
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                  ({t('optional')})
                </span>
              )}
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              className="input"
            />
            {errors.email && <FieldError message={errors.email} />}
          </div>

          <div>
            <label htmlFor="contact-phone" className="form-label">
              {t('phone')}
            </label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              placeholder={t('phonePlaceholder')}
              className="input"
            />
            {errors.phone && <FieldError message={errors.phone} />}
          </div>

          <div>
            <FormDropdown
              id="repair-state"
              label={t('state')}
              options={states}
              value={selectedState}
              onChange={setSelectedState}
              placeholder={t('statePlaceholder')}
              error={errors.state}
              dataTestId="repair-state-dropdown"
            />
            <input ref={stateInputRef} type="hidden" name="state" value={selectedState} />
          </div>
        </div>

        <div>
          <FormDropdown
            id="repair-category"
            label={t('category')}
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder={t('categoryPlaceholder')}
            error={errors.category}
            dataTestId="repair-category-dropdown"
          />
          <input ref={categoryInputRef} type="hidden" name="category" value={selectedCategory} />
        </div>

        {selectedCategory && (
          <div>
            <FormDropdown
              id="repair-product"
              label={t('product')}
              options={productOptions}
              value={selectedProduct}
              onChange={setSelectedProduct}
              placeholder={
                loadingProducts
                  ? 'Loading products...'
                  : productsError
                  ? 'Error loading products'
                  : productOptions.length === 0
                  ? 'No products available'
                  : t('productPlaceholder')
              }
              error={errors.product}
              disabled={loadingProducts || productOptions.length === 0}
              dataTestId="repair-product-dropdown"
            />
            <input ref={productInputRef} type="hidden" name="product" value={selectedProduct} />
          </div>
        )}

        <div>
          <label htmlFor="contact-message" className="form-label">
            {t('message')}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder={t('messagePlaceholder')}
            className="textarea"
          />
          {errors.message && <FieldError message={errors.message} />}
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
