'use server';

import { createApi } from 'lib/api';
import { addToCart, removeFromCart, updateCart } from 'lib/bigcommerce';
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

export async function addItem(
  prevState: any,
  {
    selectedProductId,
    selectedVariantId
  }: {
    selectedProductId: string | undefined;
    selectedVariantId: string | undefined;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!selectedVariantId) {
    return 'Missing product variant ID';
  }

  try {
    const { id } = await addToCart(cartId ?? '', [
      { merchandiseId: selectedVariantId, quantity: 1, productId: selectedProductId }
    ]);
    revalidateTag(TAGS.cart);
    cookies().set('cartId', id);
  } catch (e) {
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

export async function removeItem(prevState: any, lineId: string) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const response = await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);

    if (!response && cartId) {
      cookies().delete('cartId');
    }
  } catch (e) {
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
    return 'Error updating item quantity';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    productSlug: string;
    variantId: string;
    quantity: number;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, productSlug, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      const response = await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);

      if (!response && cartId) {
        cookies().delete('cartId');
      }

      return;
    }

    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
        productSlug
      }
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
