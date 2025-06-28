'use client';

import FormDropdown from '@shared/components/form-dropdown';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ListItem } from '.';

export default function FilterItemDropdown({
  list,
  placeholder
}: {
  list: ListItem[];
  placeholder?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState('');

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ('path' in listItem && pathname === listItem.path) ||
        ('slug' in listItem && searchParams.get('sort') === listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  const handleChange = (value: string) => {
    const selectedItem = list.find((item) => item.title === value);
    if (!selectedItem) return;

    if ('path' in selectedItem) {
      // Handle path-based navigation
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('q');
      window.location.href = createUrl(selectedItem.path, newParams);
    } else if ('slug' in selectedItem) {
      // Handle sort-based navigation
      const q = searchParams.get('q');
      const href = createUrl(
        pathname,
        new URLSearchParams({
          ...(q && { q }),
          ...(selectedItem.slug && selectedItem.slug.length && { sort: selectedItem.slug })
        })
      );
      window.location.href = href;
    }
  };

  // Convert list items to dropdown options
  const options = list.map((item, index) => ({
    id: index,
    name: item.title,
    path: 'path' in item ? item.path : undefined,
    slug: 'slug' in item ? item.slug : undefined
  }));

  return (
    <FormDropdown
      label=""
      options={options}
      value={active}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}

// Helper function to create URLs (copied from lib/utils)
function createUrl(pathname: string, params: URLSearchParams) {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;
  return `${pathname}${queryString}`;
}
