'use client';

import clsx from 'clsx';
import { createApi } from 'lib/api';
import { Category, GlobalSettings } from 'lib/api/types';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';
import { Pagination } from './pagination';
import { ProductsList } from './products-list';
import { SectionTitle } from './section-title';

interface CategoriesGridProps {
  categories: Category[];
  settings: GlobalSettings;
}

// SWR fetcher function using the API client
const fetcher = async (params: { categoryId: number; page: number; locale: string }) => {
  if (!params.categoryId) return { products: [], total: 0 };

  const api = createApi({ language: params.locale });
  const result = await api.getProducts({
    category_id: params.categoryId.toString(),
    order_by: 'selling_count',
    per_page: '6',
    page: params.page.toString()
  });

  if (result.isErr()) {
    throw new Error('Failed to fetch products');
  }

  return {
    products: result.value.data.products.data,
    total: result.value.data.products.total,
    currentPage: result.value.data.products.current_page,
    lastPage: result.value.data.products.last_page
  };
};

export function CategoriesGrid({ categories, settings }: CategoriesGridProps) {
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categories?.[0]?.id || null
  );
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(
    categories?.[0]?.parent_id === null ? categories[0].id : categories[0].parent_id
  );
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations('Products');

  // SWR hook for fetching products
  const { data, error, isLoading } = useSWR(
    selectedCategory ? `category-${selectedCategory}-page-${currentPage}-${locale}` : null,
    () => fetcher({ categoryId: selectedCategory!, page: currentPage, locale })
  );

  if (!categories?.length) return null;

  // Filter categories based on client
  let filteredCategories = categories;
  if (process.env.NEXT_PUBLIC_CLIENT === 'arkan') {
    filteredCategories = categories.filter((cat) => cat.id !== 44);
  }

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

  // Get current parent category and its children
  const currentParentCategory = allCategories.find((cat) => cat.id === selectedParentCategory);
  const childCategories = currentParentCategory?.children || [];

  // Get selected category data and build breadcrumb
  const selectedCategoryData = allCategories.find((cat) => cat.id === selectedCategory);
  const breadcrumb = [];
  if (selectedCategoryData) {
    if (selectedCategoryData.parent_id) {
      const parent = allCategories.find((cat) => cat.id === selectedCategoryData.parent_id);
      if (parent) breadcrumb.push(parent);
    }
    breadcrumb.push(selectedCategoryData);
  }

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.lastPage || 1;

  // Handle parent category selection
  const handleParentCategoryChange = (categoryId: number) => {
    setSelectedParentCategory(categoryId);
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Handle child category selection
  const handleChildCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-8">
      {/* Title Section */}
      <SectionTitle title={t('categories')} />

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

      {/* Parent Categories */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {topLevelCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleParentCategoryChange(category.id)}
              className={clsx(
                'rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:shadow-md',
                selectedParentCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              {category.name}
              {category.children?.length > 0 && (
                <span className="ms-2 text-xs opacity-75">({category.children.length})</span>
              )}
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
                selectedCategory === selectedParentCategory
                  ? 'border-primary-300 bg-primary-100 text-primary-700 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              All {currentParentCategory?.name}
            </button>
            {childCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleChildCategoryChange(category.id)}
                className={clsx(
                  'rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 hover:shadow-sm',
                  selectedCategory === category.id
                    ? 'border-primary-300 bg-primary-100 text-primary-700 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Section */}
      {selectedCategory && (
        <>
          {isLoading ? (
            <CategoryProductsSkeleton />
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Failed to load products for this category.
              </p>
            </div>
          ) : (
            <>
              <ProductsList
                products={products}
                settings={settings}
                title={`${selectedCategoryData?.name} Products`}
              />

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

// Loading skeleton for category products
function CategoryProductsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-[5/4] w-full animate-pulse rounded-theme bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    </div>
  );
}
