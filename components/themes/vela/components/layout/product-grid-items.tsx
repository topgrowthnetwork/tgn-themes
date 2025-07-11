import { Product } from 'lib/api/types';
import Grid from '../grid';
import { ProductCard } from '../product-card';

export default function ProductGridItems({
  products,
  currency
}: {
  products: Product[];
  currency: string;
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.id} className="animate-fadeIn">
          <ProductCard
            product={product}
            currency={currency}
            className="relative inline-block h-full w-full"
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </Grid.Item>
      ))}
    </>
  );
}
