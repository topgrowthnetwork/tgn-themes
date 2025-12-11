'use client';

import { NavbarSkeleton } from '@shared/components/skeletons';
import { useCategories, useGlobalSettings, useProducts } from 'lib/hooks/api';
import { Link } from 'lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import Cart from '../../cart';
import OpenCart from '../../cart/open-cart';
import LogoSquare from '../../logo-square';
import MobileMenu from './mobile-menu';
import Search from './search';

function NavbarContent() {
  const t = useTranslations('Navigation');

  const { data: settings, isLoading: settingsLoading } = useGlobalSettings();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts({
    recomended: '1',
    per_page: '3',
    sort: 'selling_count'
  });

  const isLoading = settingsLoading || categoriesLoading || productsLoading;

  if (isLoading || !settings || !categoriesData) {
    return <NavbarSkeleton />;
  }

  const categories = categoriesData.categories;
  const products = productsData?.products.data ?? [];

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="me-2 block flex-none">
        <Suspense
          fallback={
            <div className="h-11 w-11 rounded-theme border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800" />
          }
        >
          <MobileMenu menu={categories} products={products} settings={settings} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="me-2 flex w-full items-center justify-center md:w-auto lg:me-6">
            <LogoSquare />
          </Link>
          <div className="ms-6 hidden items-center gap-4 lg:flex">
            <Link
              href={`/products`}
              className="block p-2 text-lg text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm"
            >
              {t('shopAll')}
            </Link>
            {process.env.NEXT_PUBLIC_REPAIR_REQUEST ? (
              <Link
                href="/repair-request"
                className="block p-2 text-lg text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm"
              >
                {t('repairRequest')}
              </Link>
            ) : (
              <Link
                href="/contact-us"
                className="block p-2 text-lg text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm"
              >
                {t('contactUs')}
              </Link>
            )}
          </div>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense
            fallback={
              <div className="h-10 w-80 rounded-theme border bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800" />
            }
          >
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          <Suspense fallback={<OpenCart />}>
            <Cart />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return <NavbarContent />;
}
