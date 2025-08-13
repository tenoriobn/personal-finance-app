import { ref, computed } from 'vue';

export function useTransactionFilters() {
  const { data } = useFetch('/api/transactions');

  const search = ref('');
  const selectedCategory = ref('All Transactions');

  const filteredTransactions = computed(() => {
    const response = data.value?.transactions || [];

    return response?.filter((transaction) => {
      const matchesSearch = transaction.name
        .toLowerCase()
        .includes(search.value.toLowerCase());

      const matchesCategory
        = selectedCategory.value === 'All Transactions'
          || transaction.category === selectedCategory.value;

      return matchesSearch && matchesCategory;
    });
  });

  return {
    search,
    selectedCategory,
    filteredTransactions,
  };
}
