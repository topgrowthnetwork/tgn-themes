import ContactPage from '@shared/pages/contact';
import { createApi } from 'lib/api';
import { setRequestLocale } from 'next-intl/server';

export const runtime = 'edge';

export const metadata = {
  title: 'Contact Us',
  description: "Get in touch with us. We'd love to hear from you."
};

export default async function Page({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

  // Fetch settings data
  const api = createApi({ language });
  const settingsResult = await api.getGlobalSettings();

  if (settingsResult.isErr()) {
    throw new Error('Failed to get settings');
  }

  return <ContactPage settings={settingsResult.value.data} />;
}
