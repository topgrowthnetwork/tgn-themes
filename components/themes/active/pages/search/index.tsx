'use client';

import { SearchPageSkeleton } from '@shared/components/skeletons';
import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import { PaginationWithUrl } from '@theme/components/pagination-with-url';
import { useGlobalSettings, useProducts } from 'lib/hooks/api';
import { getProductParams } from 'lib/utils';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const t = useTranslations('Search');
  const searchParams = useSearchParams();

  const searchValue = searchParams.get('q') || undefined;
  const sort = searchParams.get('sort') || undefined;
  const page = searchParams.get('page') || '1';

  const productParams = getProductParams(sort, searchValue);

  const { data: productsData, isLoading: productsLoading } = useProducts({
    ...productParams,
    page,
    per_page: '12'
  });
  const { data: settings, isLoading: settingsLoading } = useGlobalSettings();

  const isLoading = productsLoading || settingsLoading;

  if (isLoading || !productsData || !settings) {
    return <SearchPageSkeleton />;
  }

  const products = productsData.products.data;
  const totalPages = productsData.products.last_page;
  const currentPage = productsData.products.current_page;

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
        <Grid className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ProductGridItems products={products} currency={settings.site_global_currency} />
        </Grid>
      ) : null}

      {/* Pagination with URL state management */}
      <PaginationWithUrl currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
