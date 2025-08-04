import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import type { Transactions } from '../transactions.type';

export function useTransactionSorting(transactions: Ref<Transactions[]>) {
  const selectedSort = ref('Oldest');

  const sortedTransactions = computed(() => {
    const transactionsCopy = [...transactions.value];
    switch (selectedSort.value) {
      case 'Latest':
        return transactionsCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'Oldest':
        return transactionsCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'A to Z':
        return transactionsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'Z to A':
        return transactionsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case 'Highest':
        return transactionsCopy.sort((a, b) => b.amount - a.amount);
      case 'Lowest':
        return transactionsCopy.sort((a, b) => a.amount - b.amount);
      default:
        return transactionsCopy;
    }
  });

  return {
    selectedSort,
    sortedTransactions,
  };
}
