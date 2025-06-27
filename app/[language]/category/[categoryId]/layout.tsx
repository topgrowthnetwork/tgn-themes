import CategoryLayout from '@theme/pages/category/layout';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <CategoryLayout>{children}</CategoryLayout>
    </Suspense>
  );
}
