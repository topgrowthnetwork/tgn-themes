'use server';

import { createApi } from 'lib/api';
import { ActionResponse } from 'lib/api/types';
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
): Promise<ActionResponse> {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    const result = await api.addToCart({
      qyt: 1,
      product_id: selectedProductId,
      product_variant_id: selectedVariantId
    });

    if (result.isErr()) {
      return {
        message: `Failed to add item to cart.`,
        success: false
      };
    }

    revalidateTag(TAGS.cart);
    cookies().set('cartId', result.value.data.cart_item.cart_id.toString());

    return {
      message: result.value.data.message || 'Added to cart successfully',
      success: true
    };
  } catch (error: any) {
    return {
      message: `Error adding item to cart.`,
      success: false
    };
  }
}

export async function removeItemV2(prevState: any, lineId: number): Promise<ActionResponse> {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    const result = await api.deleteCartItem(lineId);

    if (result.isErr()) {
      return {
        message: `Failed to remove item from cart.`,
        success: false
      };
    }

    revalidateTag(TAGS.cart);
    return {
      message: result.value.data.message || 'Removed from cart successfully',
      success: true
    };
  } catch (error: any) {
    return {
      message: `Error removing item from cart.`,
      success: false
    };
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
): Promise<ActionResponse> {
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
      return {
        message: `Failed to update item quantity.`,
        success: false
      };
    }

    revalidateTag(TAGS.cart);
    return {
      message: 'Updated item quantity successfully',
      success: true
    };
  } catch (error: any) {
    return {
      message: `Error updating item quantity.`,
      success: false
    };
  }
}

export async function applyCouponV2(prevState: any, couponCode: string): Promise<ActionResponse> {
  const guestToken = cookies().get('guest_token')?.value;
  const api = createApi({ language: 'en', guestToken });

  try {
    const result = await api.applyCoupon(couponCode);

    if (result.isErr()) {
      return {
        message: `Failed to apply coupon.`,
        success: false
      };
    }

    revalidateTag(TAGS.cart);
    return {
      message: result.value.data.message || 'Coupon applied successfully',
      success: true
    };
  } catch (error: any) {
    return {
      message: `Error applying coupon.`,
      success: false
    };
  }
}
