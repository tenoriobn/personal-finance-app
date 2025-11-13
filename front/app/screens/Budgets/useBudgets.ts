import { useApiGet } from '~/composables/api/useApiMethods';
import type { BudgetData } from './budgets.type';

export function useBudgets() {
  const budgets = useState<BudgetData[]>('budgets', () => []);
  const pending = ref(false);

  async function getBudgets() {
    try {
      pending.value = true;
      const { data, error } = await useApiGet<BudgetData[]>('budgets');
      if (!error.value && data.value) {
        budgets.value = data.value;
      }
    }
    finally {
      pending.value = false;
    }
  }

  return { budgets, getBudgets, pending };
}
