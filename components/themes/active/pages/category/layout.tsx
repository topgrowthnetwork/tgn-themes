import Container from '@theme/components/container';
import Footer from '@theme/components/layout/footer';
import FilterList from '@theme/components/layout/search/filter';
import { getSortingOptions } from 'lib/constants';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

export default async function CategoryLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Sorting');
  const commonT = await getTranslations('Common');
  const sortingOptions = getSortingOptions(t);

  return (
    <>
      <Container>
        <div className="flex flex-col gap-8">
          <FilterList list={sortingOptions} title={commonT('sortBy')} />
          {children}
        </div>
      </Container>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
