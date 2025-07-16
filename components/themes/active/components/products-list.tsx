import { GlobalSettings, Product } from 'lib/api/types';
import { ProductCard } from './product-card';

interface ProductsListProps {
  products: Product[];
  settings: GlobalSettings;
  title?: string;
}

export function ProductsList({ products, settings, title }: ProductsListProps) {
  if (!products?.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No products found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currency={settings.site_global_currency}
            className="aspect-[5/4] w-full"
          />
        ))}
      </div>
    </div>
  );
}
