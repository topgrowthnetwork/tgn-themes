import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import { createApi } from 'lib/api';
import { Product } from 'lib/api/types';
import { getLocale } from 'next-intl/server';

interface CategoryPageProps {
  products: Product[];
}

export default async function CategoryPage({ products }: CategoryPageProps) {
  const locale = await getLocale();
  const api = createApi({ language: locale });
  const settingsResult = await api.getGlobalSettings();

  if (settingsResult.isErr()) {
    return null;
  }

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems
            products={products}
            currency={settingsResult.value.data.site_global_currency}
          />
        </Grid>
      )}
    </section>
  );
}
