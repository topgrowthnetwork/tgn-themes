import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import { PaginationWithUrl } from '@theme/components/pagination-with-url';
import { GlobalSettings, ProductsResponse } from 'lib/api/types';

interface SearchPageProps {
  productsResult: ProductsResponse;
  searchValue?: string;
  settings: GlobalSettings;
}

export default function SearchPage({ productsResult, searchValue, settings }: SearchPageProps) {
  const products = productsResult.products.data;
  const totalPages = productsResult.products.last_page;
  const currentPage = productsResult.products.current_page;
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <div className="space-y-8">
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {products.length > 0 ? (
        <Grid className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <ProductGridItems products={products} currency={settings.site_global_currency} />
        </Grid>
      ) : null}

      {/* Pagination with URL state management */}
      <PaginationWithUrl currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
