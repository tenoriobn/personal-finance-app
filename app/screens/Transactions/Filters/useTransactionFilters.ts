import { ref, computed } from 'vue';
import data from '~/data/data.json';

export function useTransactionFilters() {
  const search = ref('');
  const selectedCategory = ref('All Transactions');

  const filteredTransactions = computed(() => {
    return data.transactions.filter((transaction) => {
      const matchesSearch = transaction.name.toLowerCase().includes(search.value.toLowerCase());

      const matchesCategory
        = selectedCategory.value === 'All Transactions' || transaction.category === selectedCategory.value;

      return matchesSearch && matchesCategory;
    });
  });

  return {
    search,
    selectedCategory,
    filteredTransactions,
  };
}
