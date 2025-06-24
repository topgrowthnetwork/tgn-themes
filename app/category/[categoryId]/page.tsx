import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { createApi } from 'lib/api';
import { getProductParams } from 'lib/utils';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { categoryId: string };
}): Promise<Metadata> {
  const api = createApi({ language: 'en' });
  const categoryResult = await api.getCategories({ categoryId: params.categoryId });
  if (categoryResult.isErr()) {
    throw new Error('Failed to get category');
  }
  const category = categoryResult.value.data.categories[0];

  if (!category) return notFound();

  return {
    title: category.name,
    description: `${category.name} products`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { categoryId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };

  const api = createApi({ language: 'en' });
  const productParams = getProductParams(sort, undefined, params.categoryId);

  const productsResult = await api.getProducts(productParams);
  if (productsResult.isErr()) {
    throw new Error('Failed to get products');
  }
  const products = productsResult.value.data.products.data;

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
