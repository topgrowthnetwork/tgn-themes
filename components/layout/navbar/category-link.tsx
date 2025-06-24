'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface CategoryLinkProps {
  category: {
    id: number;
    name: string;
  };
}

export default function CategoryLink({ category }: CategoryLinkProps) {
  const params = useParams();
  const currentCategoryId = params.categoryId;

  const isActive = currentCategoryId === category.id.toString();

  return (
    <Link
      href={`/category/${category.id}`}
      className={clsx(
        'text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300',
        {
          'text-black underline dark:text-neutral-300': isActive
        }
      )}
    >
      {category.name}
    </Link>
  );
}
