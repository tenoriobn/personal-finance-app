import type { TransactionsResponse } from '~/types/transactions.type';
import { useApiGet } from '../api/useApiMethods';
import { useTransactionState } from './useTransactionState';

export function useTransactions(endpoint: string) {
  const { search, selectedCategory, selectedSort, currentPage, limit } = useTransactionState();

  const { data, pending, refresh } = useApiGet<TransactionsResponse>(endpoint, {
    query: {
      search,
      categoryId: selectedCategory,
      sort: selectedSort,
      page: currentPage,
      limit,
    },
    watch: [search, selectedCategory, selectedSort, currentPage],
  });

  const transactions = computed(() => data.value?.data ?? []);
  const totalPages = computed(() => data.value?.totalPages ?? 1);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  watch([search, selectedCategory, selectedSort], () => {
    currentPage.value = 1;
  });

  return {
    search,
    selectedCategory,
    selectedSort,
    currentPage,
    totalPages,
    transactions,
    goToPage,
    pending,
    refresh,
  };
}
