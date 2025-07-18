'use client';

import { ProductsGridSkeleton } from '@shared/components';
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
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations('Products');

  // SWR hook for fetching products
  const { data, error, isLoading } = useSWR(
    selectedCategory ? `category-${selectedCategory}-page-${currentPage}-${locale}` : null,
    () => fetcher({ categoryId: selectedCategory!, page: currentPage, locale })
  );

  if (!categories?.length) return null;

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);
  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.lastPage || 1;

  // Reset page when category changes
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-8">
      {/* Title Section */}
      <SectionTitle title={t('categories')} />

      {/* Categories Row */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={clsx(
              'rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:shadow-md',
              selectedCategory === category.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Section */}
      {selectedCategory && (
        <>
          {isLoading ? (
            <ProductsGridSkeleton count={6} showTitle={true} />
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
