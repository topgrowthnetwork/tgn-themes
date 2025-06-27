import { Carousel } from '@theme/carousel';
import { ThreeItemGrid } from '@theme/grid/three-items';
import Footer from '@theme/layout/footer';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

export const runtime = 'edge';

export default async function HomePage({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;

  // Enable static rendering
  setRequestLocale(language);

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
