import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import FilterList from '@theme/components/layout/search/filter';
import { PaginationWithUrl } from '@theme/components/pagination-with-url';
import { SectionTitle } from '@theme/components/section-title';
import { GlobalSettings, ProductsResponse } from 'lib/api/types';
import { getSortingOptions } from 'lib/constants';
import { getTranslations } from 'next-intl/server';

interface CategoryPageProps {
  productsResult: ProductsResponse;
  settings: GlobalSettings;
  categoryName?: string;
}

export default async function CategoryPage({
  productsResult,
  settings,
  categoryName
}: CategoryPageProps) {
  const products = productsResult.products.data;
  const totalPages = productsResult.products.last_page;
  const currentPage = productsResult.products.current_page;

  const t = await getTranslations('Sorting');
  const commonT = await getTranslations('Common');
  const sortingOptions = getSortingOptions(t);

  return (
    <section className="space-y-8">
      {categoryName && <SectionTitle title={categoryName} />}

      <FilterList list={sortingOptions} title={commonT('sortBy')} />

      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <ProductGridItems products={products} currency={settings.site_global_currency} />
        </Grid>
      )}

      {/* Pagination with URL state management */}
      <PaginationWithUrl currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
