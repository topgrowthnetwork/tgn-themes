import Container from '@theme/container';
import Footer from '@theme/layout/footer';
import FilterList from '@theme/layout/search/filter';
import { getSortingOptions } from 'lib/constants';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

export default async function SearchLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Sorting');
  const commonT = await getTranslations('Common');
  const sortingOptions = getSortingOptions(t);

  return (
    <Suspense>
      <Container>
        <div className="flex flex-col gap-8">
          <FilterList list={sortingOptions} title={commonT('sortBy')} />
          {children}
        </div>
      </Container>
      <Footer />
    </Suspense>
  );
}
