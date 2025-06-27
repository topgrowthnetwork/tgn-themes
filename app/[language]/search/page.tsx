import Grid from '@theme/grid';
import ProductGridItems from '@theme/layout/product-grid-items';
import { createApi } from 'lib/api';
import { getProductParams } from 'lib/utils';

export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { q: searchValue, sort } = searchParams as { [key: string]: string };
  const productParams = getProductParams(sort, searchValue);

  const api = createApi({ language: 'en' });
  const productsResult = await api.getProducts(productParams);
  if (productsResult.isErr()) {
    throw new Error('Failed to get products');
  }
  const products = productsResult.value.data.products.data;
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
