import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { createApi } from 'lib/api';
import { Product } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

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

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const api = createApi({ language: 'en' });
  const productResult = await api.getProduct(params.handle);
  if (productResult.isErr()) {
    throw new Error('Failed to get product');
  }
  const { product, images, attributes, combinations } = productResult.value.data;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: getFullPath(product.thumbnail?.path || ''),
    offers: {
      '@type': 'AggregateOffer',
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceCurrency: 'EGP',
      highPrice: product.price,
      lowPrice: product.price
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={images.map((image) => ({
                src: getFullPath(image.path),
                altText: image.title
              }))}
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} attributes={attributes} />
          </div>
        </div>
        <Suspense>
          <RelatedProducts product={product} />
        </Suspense>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

async function RelatedProducts({ product }: { product: Product }) {
  const api = createApi({ language: 'en' });
  const relatedProductsResult = await api.getProducts({
    category_id: product.category_id.toString()
  });
  if (relatedProductsResult.isErr()) {
    return null;
  }

  const relatedProducts = relatedProductsResult.value.data.products.data;
  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.slug}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link className="relative h-full w-full" href={`/product/${product.slug}`}>
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.price.toString(),
                  currencyCode: 'EGP'
                }}
                src={getFullPath(product.thumbnail?.path || '')}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
