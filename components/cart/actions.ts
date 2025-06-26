'use server';

import { createApi } from 'lib/api';
import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItemV2(
  prevState: any,
  {
    selectedProductId,
    selectedVariantId
  }: {
    selectedProductId: number;
    selectedVariantId: number;
  }
) {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    const result = await api.addToCart({
      qyt: 1,
      product_id: selectedProductId,
      product_variant_id: selectedVariantId
    });
    if (result.isErr()) {
      throw new Error('Failed to add item to cart');
    }
    revalidateTag(TAGS.cart);
    cookies().set('cartId', result.value.data.cart_item.cart_id.toString());

    return result.value.data.message || 'Added to cart successfully';
  } catch (error: any) {
    return 'Error adding item to cart';
  }
}

export async function removeItemV2(prevState: any, lineId: number) {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    const result = await api.deleteCartItem(lineId);
    if (result.isErr()) {
      throw new Error('Failed to remove item from cart');
    }
    revalidateTag(TAGS.cart);
    return result.value.data.message || 'Removed from cart successfully';
  } catch (error: any) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantityV2(
  prevState: any,
  {
    lineId,
    quantity
  }: {
    lineId: number;
    quantity: number;
  }
) {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    const result = await api.updateCartItem(lineId, { qyt: quantity });
    if (result.isErr()) {
      throw new Error('Failed to update item quantity');
    }
    revalidateTag(TAGS.cart);
    return 'Updated item quantity successfully';
  } catch (error: any) {
    return 'Error updating item quantity.';
  }
}
