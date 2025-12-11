'use client';

import { CategoryPageSkeleton } from '@shared/components/skeletons';
import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import FilterList from '@theme/components/layout/search/filter';
import { PaginationWithUrl } from '@theme/components/pagination-with-url';
import { SectionTitle } from '@theme/components/section-title';
import { useCategories, useGlobalSettings, useProducts } from 'lib/hooks/api';
import { getSortingOptions } from 'lib/constants';
import { Link } from 'lib/i18n/navigation';
import { getProductParams } from 'lib/utils';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

interface CategoryPageProps {
  categoryId: string;
}

export default function CategoryPage({ categoryId }: CategoryPageProps) {
  const t = useTranslations('Category');
  const sortingT = useTranslations('Sorting');
  const commonT = useTranslations('Common');
  const searchParams = useSearchParams();

  const sort = searchParams.get('sort') || undefined;
  const page = searchParams.get('page') || '1';
  const productParams = getProductParams(sort, undefined, categoryId);

  const { data: productsData, isLoading: productsLoading } = useProducts({
    ...productParams,
    page,
    per_page: '16'
  });
  const { data: settings, isLoading: settingsLoading } = useGlobalSettings();
  const { data: categoryData, isLoading: categoryLoading } = useCategories({
    category_id: categoryId
  });

  const isLoading = productsLoading || settingsLoading || categoryLoading;

  if (isLoading || !productsData || !settings || !categoryData) {
    return <CategoryPageSkeleton />;
  }

  const products = productsData.products.data;
  const totalPages = productsData.products.last_page;
  const currentPage = productsData.products.current_page;
  const category = categoryData.category;
  const subcategories = categoryData.categories;
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
          <ProductGridItems products={products} currency={settings.site_global_currency} />
        </Grid>
      )}

      {/* Pagination with URL state management */}
      <PaginationWithUrl currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
