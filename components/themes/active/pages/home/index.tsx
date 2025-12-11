'use client';

import {
  CategoriesGridSkeleton,
  ProductsCarouselSkeleton,
  SliderSkeleton,
  ThreeItemGridSkeleton
} from '@shared/components/skeletons';
import { CategoriesGrid } from '@theme/components/categories-grid';
import CategoriesWithImages from '@theme/components/categories-with-images';
import Container from '@theme/components/container';
import { ThreeItemGrid } from '@theme/components/grid/three-items';
import { ProductsCarousel } from '@theme/components/products-carousel';
import { SliderCarousel } from '@theme/components/slider-carousel';
import { useCategories, useGlobalSettings, useProducts, useSliders } from 'lib/hooks/api';

export default function HomePage() {
  const { data: slidersData, isLoading: slidersLoading } = useSliders();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts({
    sort: 'selling_count',
    per_page: '3',
    recomended: '1'
  });
  const { data: settings, isLoading: settingsLoading } = useGlobalSettings();

  const sliders = slidersData?.sliders ?? [];
  const categories = categoriesData?.categories ?? [];
  const products = productsData?.products.data ?? [];

  return (
    <>
      <Container>
        {slidersLoading ? <SliderSkeleton /> : <SliderCarousel sliders={sliders} />}
      </Container>

      {process.env.NEXT_PUBLIC_CLIENT !== 'arkan' && (
        <Container>
          {productsLoading || settingsLoading || !settings ? (
            <ThreeItemGridSkeleton />
          ) : (
            <ThreeItemGrid products={products} settings={settings} />
          )}
        </Container>
      )}

      <Container className="!max-w-none !px-0">
        {settingsLoading || !settings ? (
          <ProductsCarouselSkeleton />
        ) : (
          <ProductsCarousel settings={settings} />
        )}
      </Container>

      <Container>
        <CategoriesWithImages />
      </Container>

      <Container>
        {categoriesLoading || settingsLoading || !settings ? (
          <CategoriesGridSkeleton />
        ) : (
          <CategoriesGrid categories={categories} settings={settings} />
        )}
      </Container>
    </>
  );
}
