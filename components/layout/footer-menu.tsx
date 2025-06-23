'use client';

import clsx from 'clsx';
import { Category } from 'lib/api/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm',
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
  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item) => {
          return <FooterMenuItem key={item.id} item={item} />;
        })}
      </ul>
    </nav>
  );
}
