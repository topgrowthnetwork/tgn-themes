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
import { useEffect, useState } from 'react';

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
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null);

  // Filter categories based on client
  let filteredCategories = categories;
  // if (process.env.NEXT_PUBLIC_CLIENT === 'arkan') {
  //   filteredCategories = categories.filter((cat) => cat.id !== 44);
  // }

  // Get top-level categories (no parent)
  const topLevelCategories = filteredCategories.filter((cat) => cat.parent_id === null);

  // Flatten all categories (including nested children) for easy searching
  const allCategories = filteredCategories.reduce((acc: Category[], cat) => {
    acc.push(cat);
    if (cat.children) {
      acc.push(...cat.children);
    }
    return acc;
  }, []);

  // Get current category from URL state (can be any category including subcategories)
  const currentCategory = allCategories.find((cat) => cat.id.toString() === category);

  // Get current parent category and its children
  const currentParentCategory = allCategories.find((cat) => cat.id === selectedParentCategory);
  const childCategories = currentParentCategory?.children || [];

  // Build breadcrumb for selected category
  const breadcrumb = [];
  if (currentCategory) {
    if (currentCategory.parent_id) {
      const parent = allCategories.find((cat) => cat.id === currentCategory.parent_id);
      if (parent) breadcrumb.push(parent);
    }
    breadcrumb.push(currentCategory);
  }

  // Set initial parent category based on selected category
  useEffect(() => {
    if (currentCategory) {
      if (currentCategory.parent_id) {
        setSelectedParentCategory(currentCategory.parent_id);
      } else {
        setSelectedParentCategory(currentCategory.id);
      }
    } else {
      setSelectedParentCategory(null);
    }
  }, [currentCategory]);

  const handleAllCategoriesClick = () => {
    setCategory(null);
    setSelectedParentCategory(null);
  };

  // Handle parent category selection
  const handleParentCategoryChange = (categoryId: number) => {
    setSelectedParentCategory(categoryId);
    setCategory(categoryId.toString());
  };

  // Handle child category selection
  const handleChildCategoryChange = (categoryId: number) => {
    setCategory(categoryId.toString());
  };

  const sortingOptions = getSortingOptions(sortingT);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      {breadcrumb.length > 1 && (
        <div className="flex items-center gap-x-2 text-sm text-gray-600 dark:text-gray-400">
          {breadcrumb.map((cat, index) => (
            <div key={cat.id} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <span
                className={
                  index === breadcrumb.length - 1
                    ? 'font-medium text-gray-900 dark:text-gray-100'
                    : ''
                }
              >
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Categories Section */}
      <div className="space-y-4">
        {/* Parent Categories Row */}
        <div className="flex flex-wrap justify-start gap-3">
          {/* All Categories Button */}
          <button
            onClick={handleAllCategoriesClick}
            className={clsx(
              'rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:shadow-md',
              !category
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {commonT('all')}
          </button>

          {topLevelCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleParentCategoryChange(cat.id)}
              className={clsx(
                'rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:shadow-md',
                selectedParentCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Child Categories */}
        {childCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleParentCategoryChange(selectedParentCategory!)}
              className={clsx(
                'rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 hover:shadow-sm',
                category === selectedParentCategory?.toString()
                  ? 'border-primary-300 bg-primary-100 text-primary-700 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              All {currentParentCategory?.name}
            </button>
            {childCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleChildCategoryChange(cat.id)}
                className={clsx(
                  'rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 hover:shadow-sm',
                  category === cat.id.toString()
                    ? 'border-primary-300 bg-primary-100 text-primary-700 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="space-y-6">
        {currentCategory && <SectionTitle title={currentCategory.name} />}

        <FilterList list={sortingOptions} title={commonT('sortBy')} />

        <div className="text-start">
          <p className="text-gray-600 dark:text-gray-400">
            {t('resultsFound', { count: products.length })}
          </p>
        </div>

        {products.length > 0 ? (
          <Grid className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <ProductGridItems products={products} currency={settings.site_global_currency} settings={settings} />
          </Grid>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">{t('noProducts')}</p>
          </div>
        )}

        {/* Pagination with URL state management */}
        {totalPages > 1 && <PaginationWithUrl currentPage={currentPage} totalPages={totalPages} />}
      </div>
    </div>
  );
}
