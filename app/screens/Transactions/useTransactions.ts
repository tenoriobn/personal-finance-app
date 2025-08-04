import { watch } from 'vue';
import { useTransactionFilters } from './Filters/useTransactionFilters';
import { useTransactionSorting } from './Filters/useTransactionSorting';
import { useTransactionPagination } from './Pagination/useTransactionPagination';

export function useTransactions() {
  const {
    search,
    selectedCategory,
    filteredTransactions,
  } = useTransactionFilters();

  const {
    selectedSort,
    sortedTransactions,
  } = useTransactionSorting(filteredTransactions);

  const {
    currentPage,
    totalPages,
    paginatedTransactions,
    goToPage,
  } = useTransactionPagination(sortedTransactions);

  watch([search, selectedCategory, selectedSort], () => {
    goToPage(1);
  });

  return {
    search,
    selectedCategory,
    selectedSort,
    currentPage,
    totalPages,
    paginatedTransactions,
    goToPage,
  };
}
