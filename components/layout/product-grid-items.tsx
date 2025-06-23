import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.id} className="animate-fadeIn">
          <Link className="relative inline-block h-full w-full" href={`/product/${product.slug}`}>
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.price.toString(),
                currencyCode: 'EGP'
              }}
              src={getFullPath(product.thumbnail?.path)}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
