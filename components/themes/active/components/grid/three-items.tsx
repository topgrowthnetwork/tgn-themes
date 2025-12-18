import { GlobalSettings, Product } from 'lib/api/types';
import { ProductCard } from '../product-card';

function ThreeItemGridItem({
  item,
  size,
  priority,
  currency,
  settings
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
  currency: string;
  settings: GlobalSettings;
}) {
  const sizes =
    size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw';

  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <ProductCard
        product={item}
        currency={currency}
        sizes={sizes}
        priority={priority}
        settings={settings}
        className="aspect-[6/5] h-full w-full"
      />
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
        settings={settings}
      />
      <ThreeItemGridItem
        size="half"
        item={secondProduct}
        priority={true}
        currency={settings.site_global_currency}
        settings={settings}
      />
      <ThreeItemGridItem size="half" item={thirdProduct} currency={settings.site_global_currency} settings={settings} />
    </section>
  );
}
