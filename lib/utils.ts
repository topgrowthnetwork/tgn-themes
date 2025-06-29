import { ReadonlyURLSearchParams } from 'next/navigation';
import { Product, ProductVariant } from './api/types';

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'BIGCOMMERCE_CANONICAL_STORE_DOMAIN',
    'BIGCOMMERCE_ACCESS_TOKEN',
    'BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN'
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    );
  }
};

/**
 * Prefixes a path with the API URL if it's not already a full URL
 * @param path The path to prefix
 * @returns The full URL or the original path if it's already a full URL
 */
export function getFullPath(path: string | null | undefined): string {
  if (!path) return '';

  // If the path is already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Prefix with API URL
  return `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
}

export function getItemPrice(
  product: { price: number; final_price: number },
  variant?: { price: number }
) {
  // Use variant price if available, otherwise use product's final price
  return variant?.price ?? product.final_price;
}

/**
 * Helper function to convert URL parameters to API parameters
 * @param sort The sort parameter from URL (e.g., 'latest-desc', 'popular')
 * @param search The search query parameter
 * @param categoryId Optional category ID for filtering
 * @returns Object with order_by, search, and category_id for API calls
 */
export function getProductParams(
  sort?: string,
  search?: string,
  categoryId?: string
): { order_by?: 'selling_count' | 'created_at'; search?: string; category_id?: string } {
  const params: {
    order_by?: 'selling_count' | 'created_at';
    search?: string;
    category_id?: string;
  } = {};

  // Add search query if provided
  if (search) {
    params.search = search;
  }

  // Add category_id if provided
  if (categoryId) {
    params.category_id = categoryId;
  }

  // Handle sorting logic
  switch (sort) {
    case 'latest-desc':
      params.order_by = 'created_at';
      break;
    case 'popular':
      params.order_by = 'selling_count';
      break;
    default:
      // Default to latest products
      params.order_by = 'created_at';
      break;
  }

  return params;
}

/**
 * Finds the cheapest available variant of a product (with stock > 0)
 * @param product - The product object containing variants
 * @returns The cheapest available variant or null if no available variants exist
 */
export function getCheapestVariant(product: Product): ProductVariant | null {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  // Filter variants with stock > 0
  const availableVariants = product.variants.filter((variant) => variant.stock > 0);

  if (availableVariants.length === 0) {
    return null;
  }

  return availableVariants.reduce((cheapest, current) => {
    return current.price < cheapest.price ? current : cheapest;
  });
}

/**
 * Gets the cheapest variant price of a product (with stock > 0)
 * @param product - The product object containing variants
 * @returns The price of the cheapest available variant, or the product's final_price if no available variants exist
 */
export function getCheapestVariantPrice(product: Product): number {
  const cheapestVariant = getCheapestVariant(product);
  return cheapestVariant ? cheapestVariant.price : product.final_price;
}

/**
 * Builds query parameters from a product variant's attributes
 * @param variant - The product variant object
 * @returns URLSearchParams string with variant ID and attribute values
 */
export function buildVariantQueryParams(variant: ProductVariant | null): string {
  if (!variant) return '';

  const params = new URLSearchParams();

  // Add variant ID
  params.set('variant', variant.id.toString());

  // Add attribute values as query params
  variant.attribute_values.forEach((attrValue) => {
    params.set(attrValue.attribute.name.toLowerCase(), attrValue.value);
  });

  return params.toString();
}

/**
 * Builds a product URL with the cheapest available variant as query parameters
 * @param product - The product object
 * @returns The product URL with variant query parameters
 */
export function buildProductUrlWithCheapestVariant(product: Product): string {
  const cheapestVariant = getCheapestVariant(product);
  const queryParams = buildVariantQueryParams(cheapestVariant);

  return queryParams ? `/product/${product.slug}?${queryParams}` : `/product/${product.slug}`;
}
