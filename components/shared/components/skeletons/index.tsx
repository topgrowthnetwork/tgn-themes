'use client';

import clsx from 'clsx';

// Base skeleton component
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx('animate-pulse rounded bg-gray-200 dark:bg-gray-700', className)}
    />
  );
}

// Navbar skeleton
export function NavbarSkeleton() {
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="me-2 block flex-none">
        <Skeleton className="h-11 w-11 rounded-theme" />
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Skeleton className="me-2 h-10 w-32" />
          <div className="ms-6 hidden items-center gap-4 lg:flex">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Skeleton className="h-10 w-80 rounded-theme" />
        </div>
        <div className="flex justify-end md:w-1/3">
          <Skeleton className="h-11 w-11 rounded-theme" />
        </div>
      </div>
    </nav>
  );
}

// Slider skeleton
export function SliderSkeleton() {
  return (
    <div className="relative w-full">
      <Skeleton className="aspect-[21/9] w-full rounded-theme md:aspect-[21/7]" />
    </div>
  );
}

// Three item grid skeleton
export function ThreeItemGridSkeleton() {
  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <div className="md:col-span-4 md:row-span-2">
        <Skeleton className="h-full min-h-[300px] w-full rounded-theme" />
      </div>
      <div className="md:col-span-2 md:row-span-1">
        <Skeleton className="h-full min-h-[200px] w-full rounded-theme" />
      </div>
      <div className="md:col-span-2 md:row-span-1">
        <Skeleton className="h-full min-h-[200px] w-full rounded-theme" />
      </div>
    </section>
  );
}

// Products carousel skeleton
export function ProductsCarouselSkeleton() {
  return (
    <div className="w-full space-y-6" dir="ltr">
      <div className="mx-auto max-w-screen-2xl px-4">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="overflow-x-auto pb-6 pt-1">
        <ul className="flex gap-4 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <li
              key={i}
              className="relative aspect-[5/4] w-2/3 min-w-[200px] max-w-[475px] flex-none md:w-1/3"
            >
              <Skeleton className="h-full w-full rounded-theme" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Categories grid skeleton
export function CategoriesGridSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-theme" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Products grid skeleton
export function ProductsGridSkeleton({
  count = 8,
  showTitle = true,
  columns = 4
}: {
  count?: number;
  showTitle?: boolean;
  columns?: 2 | 3 | 4;
}) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className="space-y-6">
      {showTitle && <Skeleton className="h-8 w-48" />}
      <div className={clsx('grid gap-4', gridCols[columns])}>
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[5/4] w-full rounded-theme" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

// Product page skeleton
export function ProductPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product images */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-theme" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-theme" />
            ))}
          </div>
        </div>
        {/* Product details */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full rounded-theme" />
          </div>
        </div>
      </div>
      {/* Related products */}
      <div className="mt-12 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-1/5 flex-none">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Category page skeleton
export function CategoryPageSkeleton() {
  return (
    <section className="space-y-8">
      <Skeleton className="h-10 w-64" />
      {/* Subcategories */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-theme" />
          ))}
        </div>
      </div>
      {/* Filter */}
      <Skeleton className="h-10 w-48" />
      {/* Products */}
      <ProductsGridSkeleton count={16} showTitle={false} />
      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded" />
        ))}
      </div>
    </section>
  );
}

// Search page skeleton
export function SearchPageSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-6 w-64" />
      <ProductsGridSkeleton count={12} showTitle={false} />
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded" />
        ))}
      </div>
    </div>
  );
}

// Checkout page skeleton
export function CheckoutPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Skeleton className="mb-8 h-10 w-48" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-11">
        <div className="space-y-6 lg:col-span-6">
          {/* Shipping form skeleton */}
          <div className="space-y-4 rounded-theme border p-6">
            <Skeleton className="h-6 w-32" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
            </div>
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
            </div>
            <Skeleton className="h-12 w-full rounded-theme" />
          </div>
        </div>
        <div className="lg:col-span-5">
          {/* Cart summary skeleton */}
          <div className="space-y-4 rounded-theme border p-6">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Home page skeleton
export function HomePageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-screen-2xl px-4">
        <SliderSkeleton />
      </div>
      <div className="mx-auto max-w-screen-2xl px-4">
        <ThreeItemGridSkeleton />
      </div>
      <ProductsCarouselSkeleton />
      <div className="mx-auto max-w-screen-2xl px-4">
        <CategoriesGridSkeleton />
      </div>
    </div>
  );
}

// Footer skeleton
export function FooterSkeleton() {
  return (
    <footer className="space-y-8 py-8">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-24" />
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-20" />
            ))}
          </div>
        ))}
      </div>
      <div className="border-t pt-8">
        <Skeleton className="h-4 w-48" />
      </div>
    </footer>
  );
}

