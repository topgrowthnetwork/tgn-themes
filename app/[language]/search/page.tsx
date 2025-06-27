import SearchPage from '@theme/pages/search';
import { createApi } from 'lib/api';
import { getProductParams } from 'lib/utils';

export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function Page({
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

  return <SearchPage products={products} searchValue={searchValue} />;
}
