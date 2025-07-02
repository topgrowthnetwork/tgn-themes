'use client';

import clsx from 'clsx';
import { Category } from 'lib/api/types';
import { Link, usePathname } from 'lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const FooterMenuItem = ({ item }: { item: Category }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === `/category/${item.id}`);

  useEffect(() => {
    setActive(pathname === `/category/${item.id}`);
  }, [pathname, item.id]);

  return (
    <li>
      <Link
        href={`/category/${item.id}`}
        className={clsx(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300',
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

export default function FooterMenu({ menu }: { menu: Category[] }) {
  const t = useTranslations('Navigation');

  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        <li>
          <Link
            href="/products"
            className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300"
          >
            {t('all')}
          </Link>
        </li>
        {menu.map((item) => {
          return <FooterMenuItem key={item.id} item={item} />;
        })}
      </ul>
    </nav>
  );
}
