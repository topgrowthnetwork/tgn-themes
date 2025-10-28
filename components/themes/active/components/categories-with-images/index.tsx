import { createApi } from 'lib/api';
import { Link } from 'lib/i18n/navigation';
import { getFullPath } from 'lib/utils';
import { filter } from 'lodash';
import { getLocale, getTranslations } from 'next-intl/server';
import JsonViewer from '../json-viewer';
import { SectionTitle } from '../section-title';
import { TileNoPrice } from '../tile-no-price';

type Props = {};

async function CategoriesWithImages({}: Props) {
  const t = await getTranslations('Category');
  const locale = await getLocale();
  const api = createApi({ language: locale });
  const categoriesResult = await api.getCategories({});

  if (categoriesResult.isErr()) {
    return null;
  }

  const categoriesWithImages = filter(categoriesResult.value.data.categories, 'thumbnail');

  return (
    <div className="space-y-8">
      <JsonViewer data={categoriesWithImages} />

      <SectionTitle title={t('categories')} />

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categoriesWithImages.map((category) => (
          <li className="aspect-square">
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
