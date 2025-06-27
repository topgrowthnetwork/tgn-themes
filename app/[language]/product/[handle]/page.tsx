import ProductPage from '@theme/pages/product';
import { createApi } from 'lib/api';
import { getFullPath } from 'lib/utils';
import { Metadata } from 'next';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const api = createApi({ language: 'en' });
  const productResult = await api.getProduct(params.handle);

  if (productResult.isErr()) {
    throw new Error('Failed to get product');
  }

  const { product } = productResult.value.data;
  return {
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

export default async function Page({ params }: { params: { handle: string } }) {
  const api = createApi({ language: 'en' });
  const productResult = await api.getProduct(params.handle);
  if (productResult.isErr()) {
    throw new Error('Failed to get product');
  }
  const { product, images, attributes, combinations } = productResult.value.data;

  return (
    <ProductPage
      product={product}
      images={images}
      attributes={attributes}
      combinations={combinations}
    />
  );
}
