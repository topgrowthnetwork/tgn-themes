'use client';

import { submitContact } from '@shared/components/contact-actions';
import FieldError from '@shared/components/field-error';
import { ToastNotification } from '@shared/components/toast-notification';
import LoadingDots from '@theme/components/loading-dots';
import { contactFormSchema } from 'lib/validation/contact';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { z } from 'zod';

function SubmitButton() {
  const t = useTranslations('Contact');
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="button flex items-center justify-center gap-2"
    >
      {pending && <LoadingDots className="bg-white" />}
      {pending ? t('sending') : t('sendMessage')}
    </button>
  );
}

export default function ContactForm() {
  const t = useTranslations('Contact');
  const [state, formAction] = useFormState(submitContact, {
    message: '',
    success: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form when successful
  useEffect(() => {
    if (state?.success) {
      setErrors({});
      formRef.current?.reset();
    }
  }, [state?.success]);

  // Client-side validation using Zod
  const validateForm = (formData: FormData): boolean => {
    try {
      // Prepare data for validation
      const dataToValidate = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        message: formData.get('message') as string
      };

      // Validate with Zod
      contactFormSchema.parse(dataToValidate);
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
            <label htmlFor="name" className="form-label">
              {t('name')}
            </label>
            <input type="text" name="name" placeholder={t('namePlaceholder')} className="input" />
            {errors.name && <FieldError message={errors.name} />}
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              {t('email')}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              className="input"
            />
            {errors.email && <FieldError message={errors.email} />}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="form-label">
            {t('phone')}
          </label>
          <input type="tel" name="phone" placeholder={t('phonePlaceholder')} className="input" />
          {errors.phone && <FieldError message={errors.phone} />}
        </div>

        <div>
          <label htmlFor="message" className="form-label">
            {t('message')}
          </label>
          <textarea
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
