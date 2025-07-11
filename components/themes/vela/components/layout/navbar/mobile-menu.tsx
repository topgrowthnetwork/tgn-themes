'use client';

import { Dialog, Transition } from '@headlessui/react';
import { useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

import { Bars3Icon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Category, GlobalSettings, Product } from 'lib/api/types';
import { Link, usePathname } from 'lib/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ProductCard } from '../../product-card';
import Search from './search';

export default function MobileMenu({
  menu,
  products,
  settings
}: {
  menu: Category[];
  products: Product[];
  settings: GlobalSettings;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);
  const t = useTranslations('Navigation');
  const commonT = useTranslations('Common');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label={t('openMobileMenu')}
        className="group flex h-12 w-12 items-center justify-center text-black transition-colors dark:text-white"
      >
        <Bars3Icon className="h-8 w-auto transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
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
            enterFrom={isRTL ? 'translate-x-full' : 'translate-x-[-100%]'}
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo={isRTL ? 'translate-x-full' : 'translate-x-[-100%]'}
          >
            <Dialog.Panel
              className={`fixed bottom-0 left-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black md:w-96 rtl:right-0`}
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-700">
                  <h2 className="text-lg font-semibold text-black dark:text-white">{t('menu')}</h2>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-theme border border-neutral-200 text-black transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                    onClick={closeMobileMenu}
                    aria-label={t('closeMobileMenu')}
                  >
                    <XMarkIcon className="h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Search - Hidden on desktop */}
                  <div className="block border-b border-neutral-200 p-4 dark:border-neutral-700 md:hidden">
                    <Search />
                  </div>

                  {/* Recommended Products */}
                  {products.length > 0 && (
                    <div className="border-b border-neutral-200 p-4 dark:border-neutral-700">
                      <h3 className="mb-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {t('recommendedProducts')}
                      </h3>
                      <div className="grid gap-3">
                        {products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            currency={settings.site_global_currency}
                            className="aspect-[4/2]"
                            sizes="(min-width: 768px) 50vw, 50vw"
                            isInteractive={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {menu.length > 0 && (
                    <div className="p-4">
                      <h3 className="mb-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {commonT('categories')}
                      </h3>
                      <ul className="space-y-1">
                        {menu.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={`/category/${item.id}`}
                              onClick={closeMobileMenu}
                              className="block rounded-theme px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Contact Us */}
                  <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
                    <Link
                      href="/contact-us"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-theme px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                      {t('contactUs')}
                    </Link>
                  </div>
                </div>

                {/* Footer with Shop All link */}
                <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
                  <Link
                    href={`/products?category=${menu[0]?.id}`}
                    onClick={closeMobileMenu}
                    className="button"
                  >
                    {t('shopAll')}
                  </Link>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
