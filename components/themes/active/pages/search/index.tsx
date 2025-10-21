import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import { PaginationWithUrl } from '@theme/components/pagination-with-url';
import { GlobalSettings, ProductsResponse } from 'lib/api/types';
import { useTranslations } from 'next-intl';

interface SearchPageProps {
  productsResult: ProductsResponse;
  searchValue?: string;
  settings: GlobalSettings;
}

export default function SearchPage({ productsResult, searchValue, settings }: SearchPageProps) {
  const t = useTranslations('Search');
  const products = productsResult.products.data;
  const totalPages = productsResult.products.last_page;
  const currentPage = productsResult.products.current_page;

  return (
    <div className="space-y-8">
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? t('noResults', { query: searchValue })
            : t('showingResults', { count: products.length, query: searchValue })}
        </p>
      ) : null}

      {products.length > 0 ? (
        <Grid className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <ProductGridItems products={products} currency={settings.site_global_currency} />
        </Grid>
      ) : null}

      {/* Pagination with URL state management */}
      <PaginationWithUrl currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
