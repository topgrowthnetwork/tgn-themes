import { CategoriesGrid } from '@theme/components/categories-grid';
import Container from '@theme/components/container';
import { ThreeItemGrid } from '@theme/components/grid/three-items';
import Footer from '@theme/components/layout/footer';
import { SliderCarousel } from '@theme/components/slider-carousel';
import { Category, GlobalSettings, Product, Slider } from 'lib/api/types';
import { Suspense } from 'react';

interface HomePageProps {
  sliders: Slider[];
  products: Product[];
  categories: Category[];
  settings: GlobalSettings;
}

export default function HomePage({ sliders, products, categories, settings }: HomePageProps) {
  return (
    <>
      <Container>
        <SliderCarousel sliders={sliders} />
      </Container>
      <Container>
        <ThreeItemGrid products={products} settings={settings} />
      </Container>
      {/* <Container className="!max-w-max !px-0">
        <ProductsCarousel products={products} settings={settings} />
      </Container> */}
      <Container>
        <CategoriesGrid categories={categories} settings={settings} />
      </Container>
      <Container className="!py-0">
        <Suspense>
          <Footer />
        </Suspense>
      </Container>
    </>
  );
}
