import { SortFilterItem } from 'lib/constants';
import FilterItemDropdown from './dropdown';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

export default function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <>
      <nav className="md:w-56">
        <FilterItemDropdown list={list} placeholder={title} />
      </nav>
    </>
  );
}
