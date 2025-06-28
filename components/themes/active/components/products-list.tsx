import { GlobalSettings, Product } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

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
          <ProductCard key={product.id} product={product} settings={settings} />
        ))}
      </div>
    </div>
  );
}

// Product Card Component (same style as products-carousel)
function ProductCard({ product, settings }: { product: Product; settings: GlobalSettings }) {
  return (
    <Link href={`/${product.slug}?page=1`} className="group block">
      <div className="relative aspect-square h-40 w-full md:h-48">
        <GridTileImage
          alt={product.title}
          label={{
            title: product.title,
            amount: product.final_price.toString(),
            currencyCode: settings.site_global_currency
          }}
          src={getFullPath(product.thumbnail?.path)}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
      </div>
    </Link>
  );
}
