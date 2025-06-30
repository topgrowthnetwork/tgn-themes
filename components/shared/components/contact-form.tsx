'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { submitContact } from '@shared/components/contact-actions';
import { NotificationMessage } from '@shared/components/notification-message';
import FieldError from '@theme/components/field-error';
import { useTranslations } from 'next-intl';
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

export default function ContactForm() {
  const t = useTranslations('Contact');
  const [state, formAction] = useFormState(submitContact, {
    success: false,
    message: ''
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormData) => {
    formAction(data);
    if (state.success) {
      reset();
    }
  };

  return (
    <div className="space-y-6">
      <NotificationMessage
        message={state.message}
        type={state.success ? 'success' : 'error'}
        autoDismiss={state.success}
        dismissDelay={5000}
      />

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
            className="form-textarea"
          />
          {errors.message && <FieldError message={errors.message.message} />}
        </div>

        <button type="submit" disabled={state.success} className="button">
          {state.success ? t('sending') : t('sendMessage')}
        </button>
      </form>
    </div>
  );
}
