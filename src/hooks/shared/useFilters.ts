import { useState } from 'react';

export function useFilters<T extends Record<string, unknown>>(initial: T) {
  const [filters, set] = useState<T>(initial);
  const reset = () => set(initial);
  return { filters, setFilters: set, reset };
}
