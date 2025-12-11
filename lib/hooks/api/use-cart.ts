'use client';

import { useCallback } from 'react';
import useSWR from 'swr';
import {
  AddToCartRequest,
  CartItemResponse,
  CartResponse,
  UpdateCartRequest
} from '../../api/types';
import { deleteFetcher, fetcher, postFetcher, putFetcher } from './fetcher';

const CART_KEY = '/api/carts';

/**
 * Fetch the current cart
 */
export function useCart() {
  const swr = useSWR<CartResponse>(CART_KEY, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000 // 5 seconds
  });

  const addToCart = useCallback(
    async (data: AddToCartRequest) => {
      const result = await postFetcher<CartItemResponse>(CART_KEY, data);
      await swr.mutate();
      return result;
    },
    [swr]
  );

  const updateCartItem = useCallback(
    async (cartItemId: number, data: UpdateCartRequest) => {
      const result = await putFetcher<CartResponse>(`${CART_KEY}/${cartItemId}`, data);
      await swr.mutate();
      return result;
    },
    [swr]
  );

  const deleteCartItem = useCallback(
    async (cartItemId: number) => {
      const result = await deleteFetcher<{ message: string }>(`${CART_KEY}/${cartItemId}`);
      await swr.mutate();
      return result;
    },
    [swr]
  );

  const applyCoupon = useCallback(
    async (couponCode: string) => {
      const result = await postFetcher<{ message: string; coupon: any }>('/api/aplly-coupon', {
        coupon_code: couponCode
      });
      await swr.mutate();
      return result;
    },
    [swr]
  );

  return {
    ...swr,
    cart: swr.data,
    addToCart,
    updateCartItem,
    deleteCartItem,
    applyCoupon
  };
}

/**
 * Add item to cart (standalone mutation)
 */
export async function addToCartAction(data: AddToCartRequest) {
  return postFetcher<CartItemResponse>(CART_KEY, data);
}

/**
 * Update cart item (standalone mutation)
 */
export async function updateCartItemAction(cartItemId: number, data: UpdateCartRequest) {
  return putFetcher<CartResponse>(`${CART_KEY}/${cartItemId}`, data);
}

/**
 * Delete cart item (standalone mutation)
 */
export async function deleteCartItemAction(cartItemId: number) {
  return deleteFetcher<{ message: string }>(`${CART_KEY}/${cartItemId}`);
}

/**
 * Apply coupon (standalone mutation)
 */
export async function applyCouponAction(couponCode: string) {
  return postFetcher<{ message: string; coupon: any }>('/api/aplly-coupon', {
    coupon_code: couponCode
  });
}
