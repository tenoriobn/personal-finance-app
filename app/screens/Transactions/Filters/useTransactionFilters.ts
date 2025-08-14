import { ref, computed } from 'vue';

export function useTransactionFilters() {
  const { data } = useFetch('/api/transactions');

  const search = ref('');
  const selectedCategory = ref('Todos');

  const filteredTransactions = computed(() => {
    const response = data.value?.transactions || [];

    return response?.filter((transaction) => {
      const matchesSearch = transaction.name
        .toLowerCase()
        .includes(search.value.toLowerCase());

      const matchesCategory
        = selectedCategory.value === 'Todos'
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
