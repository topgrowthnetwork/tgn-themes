import { GlobalSettings, Product } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import Link from 'next/link';
import { GridTileImage } from './tile';

function ThreeItemGridItem({
  item,
  size,
  priority,
  currency
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
  currency: string;
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
            currencyCode: currency
          }}
        />
      </Link>
    </div>
  );
}

export function ThreeItemGrid({
  products,
  settings
}: {
  products: Product[];
  settings: GlobalSettings;
}) {
  if (!products[0] || !products[1] || !products[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = products;

  return (
    <section className="grid gap-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem
        size="full"
        item={firstProduct}
        priority={true}
        currency={settings.site_global_currency}
      />
      <ThreeItemGridItem
        size="half"
        item={secondProduct}
        priority={true}
        currency={settings.site_global_currency}
      />
      <ThreeItemGridItem size="half" item={thirdProduct} currency={settings.site_global_currency} />
    </section>
  );
}
