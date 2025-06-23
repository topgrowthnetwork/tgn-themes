import OpengraphImage from 'components/opengraph-image';
import { createApi } from 'lib/api';

export const runtime = 'edge';

export default async function Image({ params }: { params: { categoryId: string } }) {
  const api = createApi({ language: 'en' });
  const categoryResponse = await api.getCategories({ categoryId: params.categoryId });
  const category = categoryResponse.data.categories[0];
  const title = category?.name;

  return await OpengraphImage({ title });
}
