import Footer from 'components/layout/footer';
import FilterList from 'components/layout/search/filter';
import { getSortingOptions } from 'lib/constants';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

export default async function SearchLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Sorting');
  const commonT = await getTranslations('Common');
  const sortingOptions = getSortingOptions(t);

  return (
    <Suspense>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black dark:text-white">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <FilterList list={sortingOptions} title={commonT('sortBy')} />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">{children}</div>
        </div>
      </div>
      <Footer />
    </Suspense>
  );
}
