import { Carousel } from '@theme/components/carousel';
import { ThreeItemGrid } from '@theme/components/grid/three-items';
import Footer from '@theme/components/layout/footer';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Suspense>
        <Carousel />
        <Suspense>
          <Footer />
        </Suspense>
      </Suspense>
    </>
  );
}
