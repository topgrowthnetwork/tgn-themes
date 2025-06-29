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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            settings={settings}
            imageContainerClassName="aspect-square h-48 w-full md:h-64"
          />
        ))}
      </div>
    </div>
  );
}
