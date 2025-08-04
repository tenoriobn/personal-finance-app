import { computed, ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { Transactions } from '../transactions.type';

export function useTransactionPagination(transactions: Ref<Transactions[]>, perPage = 10) {
  const currentPage = ref(1);

  const totalPages = computed(() =>
    Math.ceil(transactions.value.length / perPage),
  );

  const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    const end = start + perPage;
    return transactions.value.slice(start, end);
  });

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  watch(transactions, () => {
    currentPage.value = 1;
  });

  return {
    currentPage,
    totalPages,
    paginatedTransactions,
    goToPage,
  };
}
