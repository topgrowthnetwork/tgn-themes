import ProductPage from '@theme/pages/product';
import { setRequestLocale } from 'next-intl/server';

export default async function Page({
  params
}: {
  params: Promise<{ language: string; handle: string }>;
}) {
  const { language, handle } = await params;

  setRequestLocale(language);

  return <ProductPage handle={handle} />;
}
