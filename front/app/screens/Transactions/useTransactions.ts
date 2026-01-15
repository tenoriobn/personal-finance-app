import type { TransactionsResponse, TransactionsCache } from '~/screens/Transactions/transactions.type';
import { useTransactionsFilters, useApiGet, useAuth } from '~/composables';

export function useTransactions() {
  const { token } = useAuth();
  const cache = useState<TransactionsCache | null>(`transactions-cache-${token.value ?? 'guest'}`, () => null);

  const { search, selectedCategory, selectedSort, currentPage, limit } = useTransactionsFilters();

  const filters = computed(() => ({
    search: search.value || null,
    categoryId: selectedCategory.value || null,
    sort: selectedSort.value || null,
    page: currentPage.value,
  }));

  const filtersAreDifferent = () => {
    if (!cache.value) {
      return true;
    }
    return (
      cache.value.filters.search !== filters.value.search
      || cache.value.filters.categoryId !== filters.value.categoryId
      || cache.value.filters.sort !== filters.value.sort
      || cache.value.filters.page !== filters.value.page
    );
  };

  const { data, pending, refresh: refreshTransactions } = useApiGet<TransactionsResponse>(
    'transactions',
    {
      query: {
        search,
        categoryId: selectedCategory,
        sort: selectedSort,
        page: currentPage,
        limit,
      },
      watch: false,
      immediate: false,
    },
  );

  if (filtersAreDifferent()) {
    refreshTransactions();
  }

  watch(
    () => data.value,
    (val) => {
      if (!val) {
        return;
      }
      cache.value = {
        filters: { ...filters.value },
        result: val,
      };
    },
  );

  watch([search, selectedCategory, selectedSort], () => {
    currentPage.value = 1;
    cache.value = null;
    refreshTransactions();
  });

  watch(currentPage, () => {
    cache.value = null;
    refreshTransactions();
  });

  const transactions = computed(() => cache.value?.result?.data ?? []);
  const totalPages = computed(() => cache.value?.result?.totalPages ?? 1);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  return {
    search,
    selectedCategory,
    selectedSort,
    currentPage,
    totalPages,
    transactions,
    goToPage,
    pending,
    refreshTransactions,
  };
}
