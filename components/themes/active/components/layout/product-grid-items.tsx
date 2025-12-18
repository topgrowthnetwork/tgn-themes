import { GlobalSettings, Product } from 'lib/api/types';
import Grid from '../grid';
import { ProductCard } from '../product-card';

export default function ProductGridItems({
  products,
  currency,
  settings
}: {
  products: Product[];
  currency: string;
  settings?: GlobalSettings;
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.id} className="animate-fadeIn">
          <ProductCard
            product={product}
            currency={currency}
            settings={settings}
            className="relative inline-block h-full w-full"
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </Grid.Item>
      ))}
    </>
  );
}
