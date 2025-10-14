import RepairRequestPage from '@shared/pages/repair-request';
import { createApi } from 'lib/api';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ language: string }>;
}): Promise<Metadata> {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  const t = await getTranslations({ locale: language, namespace: 'Metadata.repairRequest' });

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function Page({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  // Fetch settings and categories data
  const api = createApi({ language });
  const [settingsResult, categoriesResult] = await Promise.all([
    api.getGlobalSettings(),
    api.getCategories()
  ]);

  if (settingsResult.isErr() || categoriesResult.isErr()) {
    throw new Error('Failed to get settings or categories');
  }

  return (
    <RepairRequestPage
      settings={settingsResult.value.data}
      categories={categoriesResult.value.data.categories}
    />
  );
}
