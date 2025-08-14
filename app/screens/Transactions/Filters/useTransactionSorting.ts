import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import type { Transactions } from '../transactions.type';

export function useTransactionSorting(transactions: Ref<Transactions[]>) {
  const selectedSort = ref('Mais recente');

  const sortedTransactions = computed(() => {
    const transactionsCopy = [...transactions.value];
    switch (selectedSort.value) {
      case 'Mais recente':
        return transactionsCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'Mais antigo':
        return transactionsCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'A a Z':
        return transactionsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'Z a A':
        return transactionsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case 'Mais alto':
        return transactionsCopy.sort((a, b) => b.amount - a.amount);
      case 'Mais baixo':
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
