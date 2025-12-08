import { useApiGet } from '~/composables';
import { computed } from 'vue';
import type { BudgetData } from './budgets.type';

export function useBudgets() {
  const { data, pending, error, refresh } = useApiGet<BudgetData[]>('budgets');

  const budgets = computed(() => data.value || []);

  return {
    budgets,
    pending,
    error,
    refreshBudgets: refresh,
  };
}
