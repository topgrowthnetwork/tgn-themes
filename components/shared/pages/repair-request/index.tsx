'use client';

import { Container } from '@shared/components';
import ContactInformation from '@shared/components/contact-information';
import { Skeleton } from '@shared/components/skeletons';
import { useCategories, useGlobalSettings } from 'lib/hooks/api';
import { useTranslations } from 'next-intl';
import RepairRequestForm from '../../components/repair-request-form';

export default function RepairRequestPage() {
  const t = useTranslations('RepairRequest');
  const { data: settings, isLoading: settingsLoading } = useGlobalSettings();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const isLoading = settingsLoading || categoriesLoading;
  const categories = categoriesData?.categories ?? [];

  return (
    <Container>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        {process.env.NEXT_PUBLIC_CLIENT === 'arkan' ? (
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('description_arkan')}</p>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('description')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="lg:col-span-1">
          {categoriesLoading ? (
            <RepairRequestFormSkeleton />
          ) : (
          <RepairRequestForm categories={categories} />
          )}
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-1">
          {isLoading || !settings ? (
            <ContactInformationSkeleton />
          ) : (
          <ContactInformation settings={settings} />
          )}
        </div>
      </div>
    </Container>
  );
}

function RepairRequestFormSkeleton() {
  return (
    <div className="space-y-6 rounded-theme border p-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded" />
        ))}
        <Skeleton className="h-32 w-full rounded" />
        <Skeleton className="h-12 w-full rounded-theme" />
      </div>
    </div>
  );
}

function ContactInformationSkeleton() {
  return (
    <div className="space-y-6 rounded-theme border p-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}
