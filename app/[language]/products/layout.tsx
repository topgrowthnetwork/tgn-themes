import Container from '@theme/components/container';
import Footer from '@theme/components/layout/footer';
import { Suspense } from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container>
        <div className="flex flex-col gap-8">{children}</div>
      </Container>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
