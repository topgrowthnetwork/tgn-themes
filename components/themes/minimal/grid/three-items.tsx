import { createApi } from 'lib/api';
import { Product } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import Link from 'next/link';
import { GridTileImage } from '../grid/tile';

function ThreeItemGridItem({
  item,
  size,
  priority
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link className="relative block aspect-square h-full w-full" href={`/product/${item.slug}`}>
        <GridTileImage
          src={getFullPath(item.thumbnail?.path)}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title as string,
            amount: item.final_price.toString(),
            currencyCode: 'EGP'
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  const api = createApi({ language: 'en' });
  const recommendedProductsResult = await api.getProducts({
    recomended: '1',
    per_page: '3'
  });
  if (recommendedProductsResult.isErr()) {
    return null;
  }

  const recommendedProducts = recommendedProductsResult.value.data.products.data;

  if (!recommendedProducts[0] || !recommendedProducts[1] || !recommendedProducts[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = recommendedProducts;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
