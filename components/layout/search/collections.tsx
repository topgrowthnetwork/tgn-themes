import clsx from 'clsx';
import { Suspense } from 'react';

import { createApi } from 'lib/api';
import { getLocale, getTranslations } from 'next-intl/server';
import FilterList from './filter';

async function CategoryList() {
  const locale = await getLocale();
  const t = await getTranslations('Common');
  const api = createApi({ language: locale });
  const categoriesResult = await api.getCategories();
  if (categoriesResult.isErr()) {
    throw new Error('Failed to get categories');
  }
  const categories = categoriesResult.value.data.categories.map((category) => ({
    title: category.name,
    path: `/search/${category.name.toLowerCase().replace(/\s+/g, '-')}`
  }));

  return <FilterList list={categories} title={t('categories')} />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function Categories() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CategoryList />
    </Suspense>
  );
}
