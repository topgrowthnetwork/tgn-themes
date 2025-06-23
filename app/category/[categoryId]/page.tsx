import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { createApi } from 'lib/api';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { categoryId: string };
}): Promise<Metadata> {
  const api = createApi({ language: 'en' });
  const categoryResponse = await api.getCategories({ categoryId: params.categoryId });
  const category = categoryResponse.data.categories[0];

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
  const productsResponse = await api.getProducts({
    category_id: params.categoryId
  });
  const products = productsResponse.data.products.data;

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
