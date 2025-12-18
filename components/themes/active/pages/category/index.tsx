import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import FilterList from '@theme/components/layout/search/filter';
import { PaginationWithUrl } from '@theme/components/pagination-with-url';
import { SectionTitle } from '@theme/components/section-title';
import { Category, GlobalSettings, ProductsResponse } from 'lib/api/types';
import { getSortingOptions } from 'lib/constants';
import { Link } from 'lib/i18n/navigation';
import { getTranslations } from 'next-intl/server';

interface CategoryPageProps {
  productsResult: ProductsResponse;
  settings: GlobalSettings;
  category: Category | null;
  subcategories: Category[];
}

export default async function CategoryPage({
  productsResult,
  settings,
  category,
  subcategories
}: CategoryPageProps) {
  const t = await getTranslations('Category');
  const sortingT = await getTranslations('Sorting');
  const commonT = await getTranslations('Common');
  const products = productsResult.products.data;
  const totalPages = productsResult.products.last_page;
  const currentPage = productsResult.products.current_page;
  const sortingOptions = getSortingOptions(sortingT);

  return (
    <section className="space-y-8">
      {category?.name && <SectionTitle title={category.name} />}

      {/* Subcategories */}
      {subcategories && subcategories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {commonT('categories')}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/category/${subcategory.id}`}
                className="group rounded-theme border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600"
              >
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
                    {subcategory.name}
                  </h4>
                  {subcategory.products_count && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {subcategory.products_count} {commonT('products').toLowerCase()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <FilterList list={sortingOptions} title={commonT('sortBy')} />

      {products.length === 0 ? (
        <p className="py-3 text-lg">{t('noProducts')}</p>
      ) : (
        <Grid className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          <ProductGridItems products={products} currency={settings.site_global_currency} settings={settings} />
        </Grid>
      )}

      {/* Pagination with URL state management */}
      <PaginationWithUrl currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
