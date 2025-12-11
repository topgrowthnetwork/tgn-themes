'use client';

import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import {
  Product,
  ProductAttributes,
  ProductCombination,
  ProductImage,
  ProductListParams,
  ProductsResponse
} from '../../api/types';
import { buildQueryString, fetcher } from './fetcher';

export interface ProductData {
  product: Product;
  images: ProductImage[] | null;
  attributes: ProductAttributes;
  combinations: ProductCombination[];
}

/**
 * Fetch a list of products with optional filters
 */
export function useProducts(params?: ProductListParams) {
  const queryString = buildQueryString(params);
  const key = `/api/products${queryString}`;

  return useSWR<ProductsResponse>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000 // 1 minute
  });
}

/**
 * Fetch a single product by slug
 */
export function useProduct(slug: string | null | undefined) {
  const key = slug ? `/api/products/${slug}` : null;

  return useSWR<ProductData>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  });
}

/**
 * Fetch a single product (immutable - won't revalidate)
 * Use this for product data that doesn't change often
 */
export function useProductImmutable(slug: string | null | undefined) {
  const key = slug ? `/api/products/${slug}` : null;

  return useSWRImmutable<ProductData>(key, fetcher);
}

/**
 * Fetch recommended products
 */
export function useRecommendedProducts(params?: Omit<ProductListParams, 'recomended'>) {
  return useProducts({ ...params, recomended: 'true' });
}

/**
 * Fetch best-selling products
 */
export function useBestSellingProducts(params?: Omit<ProductListParams, 'sort'>) {
  return useProducts({ ...params, sort: 'best_selling' });
}

/**
 * Fetch newest products
 */
export function useNewestProducts(params?: Omit<ProductListParams, 'sort'>) {
  return useProducts({ ...params, sort: 'newest' });
}

/**
 * Fetch products by category
 */
export function useProductsByCategory(
  categoryId: string | null | undefined,
  params?: Omit<ProductListParams, 'category_id'>
) {
  return useProducts(categoryId ? { ...params, category_id: categoryId } : undefined);
}

/**
 * Search products
 */
export function useProductSearch(
  searchTerm: string | null | undefined,
  params?: Omit<ProductListParams, 'search'>
) {
  return useProducts(searchTerm ? { ...params, search: searchTerm } : undefined);
}

