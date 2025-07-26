'use client';

import clsx from 'clsx';
import { Category } from 'lib/api/types';
import { Link, usePathname } from 'lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const FooterMenuItem = ({ item, isChild = false }: { item: Category; isChild?: boolean }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === `/category/${item.id}`);

  useEffect(() => {
    setActive(pathname === `/category/${item.id}`);
  }, [pathname, item.id]);

  return (
    <li className={isChild ? 'ms-4' : ''}>
      <Link
        href={`/category/${item.id}`}
        className={clsx(
          'block p-2 underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block',
          isChild
            ? 'text-sm text-neutral-600 dark:text-neutral-400'
            : 'text-lg font-medium md:text-sm',
          {
            'text-black dark:text-neutral-300': active
          }
        )}
      >
        {item.name}
      </Link>
    </li>
  );
};

const FooterCategoryGroup = ({ category }: { category: Category }) => {
  return (
    <>
      <FooterMenuItem item={category} />
      {category.children && category.children.length > 0 && (
        <>
          {category.children.map((child) => (
            <FooterMenuItem key={child.id} item={child} isChild={true} />
          ))}
        </>
      )}
    </>
  );
};

export default function FooterMenu({ menu }: { menu: Category[] }) {
  const t = useTranslations('Navigation');

  if (!menu.length) return null;

  // Get top-level categories (no parent)
  const topLevelCategories = menu.filter((cat) => cat.parent_id === null);

  return (
    <nav>
      <ul className="space-y-1">
        <li>
          <Link
            href={`/products`}
            className="block p-2 text-lg font-medium underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm"
          >
            {t('all')}
          </Link>
        </li>
        {topLevelCategories.map((category) => (
          <FooterCategoryGroup key={category.id} category={category} />
        ))}
      </ul>
    </nav>
  );
}
