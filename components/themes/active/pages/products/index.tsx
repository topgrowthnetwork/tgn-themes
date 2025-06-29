'use client';

import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import FilterList from '@theme/components/layout/search/filter';
import { PaginationWithUrl } from '@theme/components/pagination-with-url';
import { SectionTitle } from '@theme/components/section-title';
import clsx from 'clsx';
import { Category, GlobalSettings, ProductsResponse } from 'lib/api/types';
import { getSortingOptions } from 'lib/constants';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

interface ProductsPageProps {
  productsResult: ProductsResponse;
  categories: Category[];
  settings: GlobalSettings;
  selectedCategory?: string;
}

export default function ProductsPage({
  productsResult,
  categories,
  settings,
  selectedCategory
}: ProductsPageProps) {
  const products = productsResult.products.data;
  const totalPages = productsResult.products.last_page;
  const currentPage = productsResult.products.current_page;
  const t = useTranslations('Products');
  const commonT = useTranslations('Common');
  const sortingT = useTranslations('Sorting');

  const [category, setCategory] = useQueryState('category', { shallow: false });

  // Get current category from server props (guaranteed to exist due to middleware)
  const currentCategory =
    categories.find((cat) => cat.id.toString() === selectedCategory) || categories[0];

  const handleCategoryChange = (categoryId: number) => {
    setCategory(categoryId.toString());
  };

  const sortingOptions = getSortingOptions(sortingT);

  return (
    <div className="space-y-6">
      {/* Categories Row */}
      <div className="flex flex-wrap justify-start gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={clsx(
              'rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:shadow-md',
              currentCategory?.id === cat.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Section */}
      {currentCategory && (
        <div className="space-y-6">
          <SectionTitle title={currentCategory.name} />

          <FilterList list={sortingOptions} title={commonT('sortBy')} />

          <div className="text-left">
            <p className="text-gray-600 dark:text-gray-400">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {products.length > 0 ? (
            <Grid className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              <ProductGridItems products={products} currency={settings.site_global_currency} />
            </Grid>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No products found in this category.
              </p>
            </div>
          )}

          {/* Pagination with URL state management */}
          {totalPages > 1 && (
            <PaginationWithUrl currentPage={currentPage} totalPages={totalPages} />
          )}
        </div>
      )}
    </div>
  );
}
