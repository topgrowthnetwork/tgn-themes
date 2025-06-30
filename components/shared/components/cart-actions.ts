'use server';

import { createApi } from 'lib/api';
import { TAGS } from 'lib/constants';
import { err, ok, Result } from 'neverthrow';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

// Define a simple response type with just a message field
interface CartActionResponse {
  message: string;
}

export async function addItemV2(
  prevState: any,
  {
    selectedProductId,
    selectedVariantId
  }: {
    selectedProductId: number;
    selectedVariantId: number;
  }
): Promise<Result<CartActionResponse, CartActionResponse>> {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    const result = await api.addToCart({
      qyt: 1,
      product_id: selectedProductId,
      product_variant_id: selectedVariantId
    });

    if (result.isErr()) {
      return err({
        message: 'Failed to add item to cart'
      });
    }

    revalidateTag(TAGS.cart);
    cookies().set('cartId', result.value.data.cart_item.cart_id.toString());

    return ok({
      message: result.value.data.message || 'Added to cart successfully'
    });
  } catch (error: any) {
    return err({
      message: 'Error adding item to cart'
    });
  }
}

export async function removeItemV2(
  prevState: any,
  lineId: number
): Promise<Result<CartActionResponse, CartActionResponse>> {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    const result = await api.deleteCartItem(lineId);

    if (result.isErr()) {
      return err({
        message: 'Failed to remove item from cart'
      });
    }

    revalidateTag(TAGS.cart);
    return ok({
      message: result.value.data.message || 'Removed from cart successfully'
    });
  } catch (error: any) {
    return err({
      message: 'Error removing item from cart'
    });
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
): Promise<Result<CartActionResponse, CartActionResponse>> {
  // If quantity is 0 or less, remove the item instead
  if (quantity <= 0) {
    return await removeItemV2(prevState, lineId);
  }

  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    // Otherwise update the quantity normally
    const result = await api.updateCartItem(lineId, { qyt: quantity });

    if (result.isErr()) {
      return err({
        message: 'Failed to update item quantity'
      });
    }

    revalidateTag(TAGS.cart);
    return ok({
      message: 'Updated item quantity successfully'
    });
  } catch (error: any) {
    return err({
      message: 'Error updating item quantity'
    });
  }
}

export async function applyCouponV2(
  prevState: any,
  couponCode: string
): Promise<Result<CartActionResponse, CartActionResponse>> {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    const result = await api.applyCoupon(couponCode);

    if (result.isErr()) {
      return err({
        message: 'Failed to apply coupon'
      });
    }

    revalidateTag(TAGS.cart);
    return ok({
      message: result.value.data.message || 'Coupon applied successfully'
    });
  } catch (error: any) {
    return err({
      message: 'Error applying coupon'
    });
  }
}
