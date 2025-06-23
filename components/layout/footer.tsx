import Link from 'next/link';

import GitHubIcon from 'components/icons/github';
import FooterMenu from 'components/layout/footer-menu';
import LogoSquare from 'components/logo-square';
import { createApi } from 'lib/api';
import { Suspense } from 'react';

export default async function Footer() {
  const api = createApi({ language: 'en' });
  const settingsResponse = await api.getGlobalSettings();
  const settings = settingsResponse.data;

  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const categoriesResponse = await api.getCategories();
  const categories = categoriesResponse.data.categories;
  const copyrightName = settings.site_title;

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm dark:border-neutral-700 md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
        <div>
          <Link className="flex items-center gap-2 text-black dark:text-white md:pt-1" href="/">
            <LogoSquare size="sm" />
            <span className="uppercase">{settings.site_title}</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={categories} />
        </Suspense>
        <div className="md:ml-auto">
          <a aria-label="Github Repository" href="https://github.com/bigcommerce/nextjs-commerce">
            <GitHubIcon className="h-6" />
          </a>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
