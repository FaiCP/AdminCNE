export interface BaseState<T> {
  items: T[];
  total: number;
  pageSize: number;
  pageIndex: number;
  searchQuery: string;
  isLoading: boolean;
  editingId: number | null;
  editingSnapshot: Partial<T>;
}

export function createBaseState<T>(): BaseState<T> {
  return {
    items: [],
    total: 0,
    pageSize: 10,
    pageIndex: 0,
    searchQuery: '',
    isLoading: false,
    editingId: null,
    editingSnapshot: {},
  };
}
