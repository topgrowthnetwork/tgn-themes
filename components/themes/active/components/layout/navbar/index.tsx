import { createApi } from 'lib/api';
import { Link } from 'lib/i18n/navigation';
import { getLocale } from 'next-intl/server';
import { Suspense } from 'react';
import Cart from '../../cart';
import OpenCart from '../../cart/open-cart';
import LogoSquare from '../../logo-square';
import MobileMenu from './mobile-menu';
import Search from './search';

export default async function Navbar() {
  const locale = await getLocale();
  const api = createApi({ language: locale });
  const settingsResult = await api.getGlobalSettings();
  if (settingsResult.isErr()) {
    return null;
  }
  const settings = settingsResult.value.data;

  const categoriesResult = await api.getCategories();
  if (categoriesResult.isErr()) {
    return null;
  }
  const categories = categoriesResult.value.data.categories;

  // Fetch recommended products for the menu
  const productsResult = await api.getProducts({
    recomended: '1',
    per_page: '3',
    order_by: 'selling_count'
  });
  const products = productsResult.isOk() ? productsResult.value.data.products.data : [];

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md lg:px-6 dark:border-neutral-700 dark:bg-black/80">
      <div className="me-2 block flex-none">
        <MobileMenu menu={categories} products={products} settings={settings} />
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="me-2 flex w-full items-center justify-center md:w-auto lg:me-6">
            <LogoSquare />
            <div className="ms-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {settings.site_title}
            </div>
          </Link>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Search />
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
