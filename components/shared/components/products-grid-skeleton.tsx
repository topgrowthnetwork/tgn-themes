interface ProductsGridSkeletonProps {
  /** Number of skeleton items to show */
  count?: number;
  /** Custom title for the skeleton */
  showTitle?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ProductsGridSkeleton({
  count = 6,
  showTitle = true,
  className = ''
}: ProductsGridSkeletonProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="aspect-[5/4] w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    </div>
  );
}
