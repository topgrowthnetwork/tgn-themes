import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import { GlobalSettings, Product } from 'lib/api/types';

interface CategoryPageProps {
  products: Product[];
  settings: GlobalSettings;
}

export default async function CategoryPage({ products, settings }: CategoryPageProps) {
  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} currency={settings.site_global_currency} />
        </Grid>
      )}
    </section>
  );
}
