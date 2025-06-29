import ProductPage from '@theme/pages/product';
import { createApi } from 'lib/api';
import { getFullPath, getSelectedVariant } from 'lib/utils';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: Promise<{ language: string; handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;

  const api = createApi({ language: 'en' });
  const productResult = await api.getProduct(handle);

  if (productResult.isErr()) {
    throw new Error('Failed to get product');
  }

  const { product } = productResult.value.data;

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    title: product.title,
    description: product.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: product.thumbnail
      ? {
          images: [
            {
              url: getFullPath(product.thumbnail.path),
              width: 1200,
              height: 630,
              alt: product.title
            }
          ]
        }
      : null
  };
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ language: string; handle: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { language, handle } = await params;

  setRequestLocale(language);

  const api = createApi({ language: 'en' });
  const [productResult, settingsResult] = await Promise.all([
    api.getProduct(handle),
    api.getGlobalSettings()
  ]);

  if (productResult.isErr() || settingsResult.isErr()) {
    throw new Error('Failed to get product');
  }
  const { product, images, attributes, combinations } = productResult.value.data;
  const settings = settingsResult.value.data;

  // Get selected variant using utility function
  const selectedVariant = getSelectedVariant(product, searchParams);

  return (
    <ProductPage
      product={product}
      images={images}
      attributes={attributes}
      combinations={combinations}
      settings={settings}
      selectedVariant={selectedVariant}
    />
  );
}
