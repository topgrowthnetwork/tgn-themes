import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import { PaginationWithUrl } from '@theme/components/pagination-with-url';
import { GlobalSettings, ProductsResponse } from 'lib/api/types';

interface CategoryPageProps {
  productsResult: ProductsResponse;
  settings: GlobalSettings;
}

export default async function CategoryPage({ productsResult, settings }: CategoryPageProps) {
  const products = productsResult.products.data;
  const totalPages = productsResult.products.last_page;
  const currentPage = productsResult.products.current_page;

  return (
    <section className="space-y-8">
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} currency={settings.site_global_currency} />
        </Grid>
      )}

      {/* Pagination with URL state management */}
      <PaginationWithUrl currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
