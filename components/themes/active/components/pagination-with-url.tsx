'use client';

import { useRouter } from 'next/navigation';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Pagination } from './pagination';

interface PaginationWithUrlProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationWithUrl({ currentPage, totalPages }: PaginationWithUrlProps) {
  const router = useRouter();

  // Use nuqs for URL state management
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(currentPage));

  const handlePageChange = (newPage: number) => {
    setPage(newPage, { shallow: false });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />;
}
