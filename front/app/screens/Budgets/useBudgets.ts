import type { BudgetData } from './budgets.type';
import { useApiGet, useAuth } from '~/composables';

export function useBudgets() {
  const { token } = useAuth();
  const cache = useState<BudgetData[] | null>(`budgets-cache-${token.value ?? 'guest'}`, () => null);

  const { data, pending, refresh } = useApiGet<BudgetData[]>('budgets', {
    watch: false,
    immediate: false,
  });

  if (!cache.value) {
    refresh();
  }

  watch(
    () => data.value,
    (val) => {
      if (val) {
        cache.value = val;
      }
    },
  );

  const budgets = computed(() => cache.value ?? []);

  return {
    budgets,
    pending,
    refreshBudgets: async () => {
      cache.value = null;
      await refresh();
    },
  };
}
