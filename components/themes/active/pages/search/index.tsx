import Grid from '@theme/components/grid';
import ProductGridItems from '@theme/components/layout/product-grid-items';
import { GlobalSettings, Product } from 'lib/api/types';

interface SearchPageProps {
  products: Product[];
  searchValue?: string;
  settings: GlobalSettings;
}

export default function SearchPage({ products, searchValue, settings }: SearchPageProps) {
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} currency={settings.site_global_currency} />
        </Grid>
      ) : null}
    </>
  );
}
