'use client';

import { CategoriesGridSkeleton } from '@shared/components/skeletons';
import { useCategories } from 'lib/hooks/api';
import { Link } from 'lib/i18n/navigation';
import { getFullPath } from 'lib/utils';
import { filter } from 'lodash';
import { useTranslations } from 'next-intl';
import { SectionTitle } from '../section-title';
import { TileNoPrice } from '../tile-no-price';

type Props = {};

function CategoriesWithImages({}: Props) {
  const t = useTranslations('Category');
  const { data: categoriesData, isLoading } = useCategories();

  if (isLoading || !categoriesData) {
    return <CategoriesGridSkeleton />;
  }

  const categoriesWithImages = filter(categoriesData.categories, 'thumbnail');

  if (categoriesWithImages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <SectionTitle title={t('categories')} />

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categoriesWithImages.map((category) => (
          <li key={category.id} className="aspect-square">
            <Link href={`/category/${category.id}`}>
              <TileNoPrice
                src={getFullPath(category.thumbnail?.path)}
                alt={''}
                label={{ title: category.name }}
                width={0}
                height={0}
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesWithImages;
