'use client';

import FormDropdown from '@shared/components/form-dropdown';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import type { ListItem } from '.';

export default function FilterItemDropdown({
  list,
  placeholder
}: {
  list: ListItem[];
  placeholder?: string;
}) {
  const [active, setActive] = useState('');
  const [sort, setSort] = useQueryState('sort', { shallow: false });
  const [q, setQ] = useQueryState('q', { shallow: false });

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ('path' in listItem && window.location.pathname === listItem.path) ||
        ('slug' in listItem && sort === listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [list, sort]);

  const handleChange = (value: string) => {
    const selectedItem = list.find((item) => item.title === value);
    if (!selectedItem) return;

    if ('path' in selectedItem) {
      // Handle path-based navigation
      // Clear search query and navigate to new path
      setQ(null);
      window.location.href = selectedItem.path;
    } else if ('slug' in selectedItem) {
      // Handle sort-based navigation
      setSort(selectedItem.slug || null);
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
