import CategoryPage from '@theme/pages/category';
import { setRequestLocale } from 'next-intl/server';

export default async function Page({
  params
}: {
  params: Promise<{ language: string; categoryId: string }>;
}) {
  const { language, categoryId } = await params;

  setRequestLocale(language);

  return <CategoryPage categoryId={categoryId} />;
}
