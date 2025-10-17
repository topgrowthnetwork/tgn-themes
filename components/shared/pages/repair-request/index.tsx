import { Container } from '@shared/components';
import ContactInformation from '@shared/components/contact-information';
import { Category, GlobalSettings } from 'lib/api/types';
import { useTranslations } from 'next-intl';
import RepairRequestForm from '../../components/repair-request-form';

interface RepairRequestPageProps {
  settings: GlobalSettings;
  categories: Category[];
}

export default function RepairRequestPage({ settings, categories }: RepairRequestPageProps) {
  const t = useTranslations('RepairRequest');

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
          <RepairRequestForm categories={categories} />
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-1">
          <ContactInformation settings={settings} />
        </div>
      </div>
    </Container>
  );
}
