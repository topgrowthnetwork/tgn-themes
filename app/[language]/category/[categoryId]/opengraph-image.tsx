import OpengraphImage from '@theme/components/opengraph-image';
import { createApi } from 'lib/api';

export const runtime = 'edge';

export default async function Image({ params }: { params: { categoryId: string } }) {
  const api = createApi({ language: 'en' });
  const categoryResult = await api.getCategories({ categoryId: params.categoryId });
  if (categoryResult.isErr()) {
    throw new Error('Failed to get category');
  }
  const category = categoryResult.value.data.categories[0];
  const title = category?.name;

  return await OpengraphImage({ title });
}
