import SearchLayout from '@theme/pages/search/layout';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <SearchLayout>{children}</SearchLayout>
    </Suspense>
  );
}
