import { useState } from 'react';

import { PAGINATION } from '@/lib/constants';

export function usePagination() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const next = () => setPage((p) => p + 1);
  const prev = () => setPage((p) => Math.max(1, p - 1));
  return { page, size, setPage, setSize, next, prev };
}
