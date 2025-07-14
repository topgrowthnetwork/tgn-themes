import { CategoriesGrid } from '@theme/components/categories-grid';
import Container from '@theme/components/container';
import { ProductsCarousel, ProductsCarouselSkeleton } from '@theme/components/products-carousel';
import { Category, GlobalSettings, Product, Slider } from 'lib/api/types';
import { Suspense } from 'react';
import { SliderCarousel } from '../../components/slider-carousel';

interface HomePageProps {
  sliders: Slider[];
  products: Product[];
  categories: Category[];
  settings: GlobalSettings;
}

export default function HomePage({ sliders, products, categories, settings }: HomePageProps) {
  return (
    <>
      <div className="sm:hidden">
        <SliderCarousel sliders={sliders} />
      </div>
      <Container className="hidden sm:block">
        <SliderCarousel sliders={sliders} />
      </Container>
      {/* <Container>
        <ThreeItemGrid products={products} settings={settings} />
      </Container> */}
      <Container className="!max-w-max !px-0">
        <Suspense fallback={<ProductsCarouselSkeleton />}>
          <ProductsCarousel settings={settings} />
        </Suspense>
      </Container>
      <Container>
        <CategoriesGrid categories={categories} settings={settings} />
      </Container>
    </>
  );
}
