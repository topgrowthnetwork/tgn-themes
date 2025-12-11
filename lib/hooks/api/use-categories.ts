'use client';

import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { CategoriesResponse, CategoryListParams } from '../../api/types';
import { buildQueryString, fetcher } from './fetcher';

/**
 * Fetch categories with optional filters
 */
export function useCategories(params?: CategoryListParams) {
  const queryString = buildQueryString(params);
  const key = `/api/categories${queryString}`;

  return useSWR<CategoriesResponse>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000 // 5 minutes - categories don't change often
  });
}

/**
 * Fetch categories (immutable - won't revalidate automatically)
 * Use this for static category lists
 */
export function useCategoriesImmutable(params?: CategoryListParams) {
  const queryString = buildQueryString(params);
  const key = `/api/categories${queryString}`;

  return useSWRImmutable<CategoriesResponse>(key, fetcher);
}

/**
 * Fetch a specific category by ID
 */
export function useCategory(categoryId: string | null | undefined) {
  return useCategories(categoryId ? { category_id: categoryId } : undefined);
}

