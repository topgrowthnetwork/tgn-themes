import ContactLayout from '@shared/pages/contact/layout';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ContactLayout>{children}</ContactLayout>
    </Suspense>
  );
}
