import { ProductsGridSkeleton } from '@shared/components';
import { createApi } from 'lib/api';
import { GlobalSettings } from 'lib/api/types';
import { getLocale, getTranslations } from 'next-intl/server';
import Container from './container';
import { ProductsList } from './products-list';
import { SectionTitle } from './section-title';

export async function BestSellersList({ settings }: { settings: GlobalSettings }) {
  const t = await getTranslations('Products');
  const language = await getLocale();

  const api = createApi({ language });
  const productsResult = await api.getProducts({
    order: 'best_selling',
    per_page: '4'
  });

  if (productsResult.isErr()) {
    return null;
  }

  const products = productsResult.value.data.products.data;

  return (
    <Container>
      <div className="space-y-6">
        <SectionTitle title={t('bestsellers')} />
        <ProductsList products={products} settings={settings} />
      </div>
    </Container>
  );
}

// Skeleton component for loading state
export function BestSellersListSkeleton() {
  return (
    <Container>
      <ProductsGridSkeleton count={4} showTitle={true} />
    </Container>
  );
}
