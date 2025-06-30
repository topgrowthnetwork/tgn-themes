'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { submitContact } from '@shared/components/contact-actions';
import FieldError from '@shared/components/field-error';
import { ButtonLoadingSpinner } from '@shared/components/loading-spinner';
import { ToastNotification } from '@shared/components/toast-notification';
import { getNotificationData } from 'lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

function SubmitButton({ disabled, isLoading }: { disabled: boolean; isLoading: boolean }) {
  const t = useTranslations('Contact');

  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="button flex items-center justify-center gap-2"
    >
      {isLoading && <ButtonLoadingSpinner />}
      {isLoading ? t('sending') : t('sendMessage')}
    </button>
  );
}

export default function ContactForm() {
  const t = useTranslations('Contact');
  const [isLoading, setIsLoading] = useState(false);
  const [state, formAction] = useFormState(submitContact, null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      await formAction(data);
      if (state?.isOk()) {
        reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {t('sendMessage')}
      </h2>
      <ToastNotification {...getNotificationData(state)} autoClose={state?.isOk() ? 5000 : false} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="form-label">
              {t('name')}
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder={t('namePlaceholder')}
              className="input"
            />
            {errors.name && <FieldError message={errors.name.message} />}
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              {t('email')}
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder={t('emailPlaceholder')}
              className="input"
            />
            {errors.email && <FieldError message={errors.email.message} />}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="form-label">
            {t('phone')}
          </label>
          <input
            type="tel"
            {...register('phone')}
            placeholder={t('phonePlaceholder')}
            className="input"
          />
          {errors.phone && <FieldError message={errors.phone.message} />}
        </div>

        <div>
          <label htmlFor="message" className="form-label">
            {t('message')}
          </label>
          <textarea
            {...register('message')}
            rows={5}
            placeholder={t('messagePlaceholder')}
            className="textarea"
          />
          {errors.message && <FieldError message={errors.message.message} />}
        </div>

        <SubmitButton disabled={state?.isOk() ?? false} isLoading={isLoading} />
      </form>
    </div>
  );
}
