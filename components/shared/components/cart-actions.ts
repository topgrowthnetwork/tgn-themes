'use server';

import { createApi } from 'lib/api';
import { ActionResponse } from 'lib/api/types';
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
      qty: 1,
      product_id: selectedProductId,
      product_variant_id: selectedVariantId
    });

    if (result.isErr()) {
      return {
        message: `Failed to add item to cart.`,
        success: false
      };
    }

    cookies().set('cartId', result.value.data.cart_item.cart_id.toString());

    // Fetch updated cart data
    const cartResult = await api.getCart();
    const cartData = cartResult.isOk() ? cartResult.value.data : undefined;

    return {
      message: result.value.message || 'Added to cart successfully',
      success: true,
      cartData
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

    // Fetch updated cart data
    const cartResult = await api.getCart();
    const cartData = cartResult.isOk() ? cartResult.value.data : undefined;

    return {
      message: result.value.message || 'Removed from cart successfully',
      success: true,
      cartData
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
    const result = await api.updateCartItem(lineId, { qty: quantity });

    if (result.isErr()) {
      return {
        message: `Failed to update item quantity.`,
        success: false
      };
    }

    // Fetch updated cart data
    const cartResult = await api.getCart();
    const cartData = cartResult.isOk() ? cartResult.value.data : undefined;

    return {
      message: 'Updated item quantity successfully',
      success: true,
      cartData
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

    // Fetch updated cart data
    const cartResult = await api.getCart();
    const cartData = cartResult.isOk() ? cartResult.value.data : undefined;

    return {
      message: result.value.message || 'Coupon applied successfully',
      success: true,
      cartData
    };
  } catch (error: any) {
    return {
      message: `Error applying coupon.`,
      success: false
    };
  }
}
