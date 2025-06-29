'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import FieldError from '@shared/components/field-error';
import { createApi } from 'lib/api';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const t = useTranslations('Contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const api = createApi({ language: 'en' });
      const result = await api.submitContact(data);

      if (result.isOk()) {
        setSubmitStatus({
          success: true,
          message: t('successMessage')
        });
        reset();
      } else {
        setSubmitStatus({
          success: false,
          message: result.error.message || t('errorMessage')
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: t('errorMessage')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {t('sendMessage')}
      </h2>

      {/* Status Message */}
      {submitStatus && (
        <div
          className={`mb-6 rounded-md p-4 ${
            submitStatus.success
              ? 'border border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'border border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="form-label">
              {t('name')} *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="form-input"
              placeholder={t('namePlaceholder')}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              {t('email')} *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="form-input"
              placeholder={t('emailPlaceholder')}
            />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="form-label">
            {t('phone')} *
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="form-input"
            placeholder={t('phonePlaceholder')}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <label htmlFor="message" className="form-label">
            {t('message')} *
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={5}
            className="form-textarea"
            placeholder={t('messagePlaceholder')}
          />
          <FieldError message={errors.message?.message} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="form-button disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? t('sending') : t('sendMessage')}
        </button>
      </form>
    </div>
  );
}
