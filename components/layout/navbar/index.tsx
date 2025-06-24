import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import LogoSquare from 'components/logo-square';
import { createApi } from 'lib/api';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search from './search';

export default async function Navbar() {
  const api = createApi({ language: 'en' });
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

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <MobileMenu menu={categories} />
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {settings.site_title}
            </div>
          </Link>
          {categories.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {categories.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/category/${item.id}`}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
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
