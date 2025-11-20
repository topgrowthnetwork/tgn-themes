'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { CartResponse } from 'lib/api/types';
import { DEFAULT_OPTION } from 'lib/constants';
import { useShipping } from 'lib/context/shipping-context';
import { getFullPath, getItemPrice } from 'lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import Price from '../price';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({
  cartResponse,
  currency
}: {
  cartResponse: CartResponse;
  currency: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cartResponse?.total_items);
  const pathname = usePathname();
  const { shippingAmount } = useShipping();
  const openCart = () => {
    if (!isCheckoutOrThankYouPage) {
      setIsOpen(true);
    }
  };
  const closeCart = () => setIsOpen(false);
  const t = useTranslations('Cart');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Calculate total with shipping
  const totalWithShipping = cartResponse?.total_price + shippingAmount;

  // Check if we're on checkout or thank-you pages
  const isCheckoutOrThankYouPage =
    pathname.includes('/checkout') || pathname.includes('/thank-you');

  useEffect(() => {
    // Open cart modal when quantity changes.
    if (cartResponse?.total_items !== quantityRef.current) {
      // But only if it's not already open (quantity also changes when editing items in cart).
      // And only if we're not on checkout or thank-you pages
      if (!isOpen && !isCheckoutOrThankYouPage) {
        setIsOpen(true);
      }

      // Always update the quantity reference
      quantityRef.current = cartResponse?.total_items;
    }
  }, [isOpen, cartResponse?.total_items, quantityRef, isCheckoutOrThankYouPage]);

  return (
    <>
      <button aria-label={t('openCart')} onClick={openCart}>
        <OpenCart quantity={cartResponse?.total_items} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} data-testid="cart-modal" className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom={isRTL ? 'translate-x-[-100%]' : 'translate-x-full'}
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo={isRTL ? 'translate-x-[-100%]' : 'translate-x-full'}
          >
            <Dialog.Panel
              className={clsx(
                'fixed bottom-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-white md:w-[390px]',
                isRTL ? 'left-0' : 'right-0'
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{t('myCart')}</p>

                <button aria-label={t('closeCart')} onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cartResponse.cart || cartResponse.cart.cart_items.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">{t('emptyCart')}</p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="flex-grow overflow-auto py-4">
                    {cartResponse.cart.cart_items.map((item, i) => {
                      const merchandiseSearchParams = {} as MerchandiseSearchParams;
                      let subTitleWithSelectedOptions = '';

                      if (item.variant) {
                        item.variant.attribute_values.forEach(({ attribute, value }) => {
                          subTitleWithSelectedOptions += `${attribute.name}: ${value} `;
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[attribute.name.toLowerCase()] = value;
                          }
                        });
                      }

                      // const merchandiseUrl = createUrl(
                      //   `/product/${item.product.title}`,
                      //   new URLSearchParams(merchandiseSearchParams)
                      // );

                      // Get the correct price: variant price if available, otherwise product price
                      const itemPrice = getItemPrice(item.product, item.variant);
                      const totalPrice = itemPrice * item.qyt;

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ms-[55px]">
                              <DeleteItemButton item={item} />
                            </div>
                            <div
                              // href={merchandiseUrl}
                              // onClick={closeCart}
                              className="z-30 flex flex-row gap-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-theme border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={item.product.thumbnail?.title || item.product.title}
                                  src={getFullPath(item.product.thumbnail?.path || '')}
                                />
                              </div>

                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">{item.product.title}</span>
                                {item.variant && item.variant.attribute_values.length > 0 ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item.variant.attribute_values
                                      .map(({ value }) => value)
                                      .join(', ')}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-end text-sm"
                                amount={totalPrice.toString()}
                                currencyCode={currency}
                              />
                              <div className="ms-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 bg-white">
                                <EditItemQuantityButton item={item} type="minus" minStock={0} />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.qyt}</span>
                                </p>
                                <EditItemQuantityButton item={item} type="plus" minStock={0} />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                      <p>{t('subtotal')}</p>
                      <Price
                        className="text-end text-base text-black dark:text-white"
                        amount={cartResponse.sub_total.toString()}
                        currencyCode={currency}
                      />
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                      <p>{t('taxes')}</p>
                      <p className="text-end">{t('taxInclusive')}</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>{t('shipping')}</p>
                      {shippingAmount > 0 ? (
                        <Price
                          className="text-end text-base text-black dark:text-white"
                          amount={shippingAmount.toString()}
                          currencyCode={currency}
                        />
                      ) : (
                        <p className="text-end">
                          {process.env.NEXT_PUBLIC_FREE_SHIPPING == 'true'
                            ? t('freeShipping')
                            : t('calculatedAtCheckout')}
                        </p>
                      )}
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>{t('total')}</p>
                      <Price
                        className="text-end text-base text-black dark:text-white"
                        amount={totalWithShipping.toString()}
                        currencyCode={currency}
                      />
                    </div>
                  </div>
                  <a href="/checkout" className="button" data-testid="proceed-to-checkout">
                    {t('proceedToCheckout')}
                  </a>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
