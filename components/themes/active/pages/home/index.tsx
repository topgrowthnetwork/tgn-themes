import { CategoriesGrid } from '@theme/components/categories-grid';
import CategoriesWithImages from '@theme/components/categories-with-images';
import Container from '@theme/components/container';
import { ThreeBannerGrid } from '@theme/components/grid/three-banners';
import { ThreeItemGrid } from '@theme/components/grid/three-items';
import { ProductsCarousel, ProductsCarouselSkeleton } from '@theme/components/products-carousel';
import { SliderCarousel } from '@theme/components/slider-carousel';
import { Banner, Category, GlobalSettings, Product, Slider } from 'lib/api/types';
import { Suspense } from 'react';

interface HomePageProps {
  sliders: Slider[];
  products: Product[];
  categories: Category[];
  settings: GlobalSettings;
  banners: Banner[];
}

export default function HomePage({ sliders, products, categories, settings, banners }: HomePageProps) {
  return (
    <>
      <Container>
        <SliderCarousel sliders={sliders} />
      </Container>
      {process.env.NEXT_PUBLIC_CLIENT === 'arkan' ? (
        <Container>
          <ThreeBannerGrid banners={banners} />
        </Container>
      ) : (
        <Container>
          <ThreeItemGrid products={products} settings={settings} />
        </Container>
      )}
      <Container className="!max-w-none !px-0">
        <Suspense fallback={<ProductsCarouselSkeleton />}>
          <ProductsCarousel settings={settings} />
        </Suspense>
      </Container>
      <Container>
        <CategoriesWithImages />
      </Container>
      <Container>
        <CategoriesGrid categories={categories} settings={settings} />
      </Container>
    </>
  );
}
