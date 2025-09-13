import { ref } from 'vue';
import type { TransactionsData } from '~/screens/Transactions/transactions.type';

type TransactionsReponse = {
  data: TransactionsData[]
  totalPages: number
};

export function useTransactions(endpoint: string) {
  const search = ref('');
  const selectedCategory = ref('Todos');
  const selectedSort = ref('Mais recente');
  const currentPage = ref(1);
  const limit = ref(10);

  const { data, pending } = useFetch<TransactionsReponse>(endpoint, {
    query: {
      search,
      category: selectedCategory,
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
  };
}
