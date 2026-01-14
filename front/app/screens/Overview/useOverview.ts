import { useApiGet } from '~/composables';
import { computed } from 'vue';
import type { OverviewResponse } from './overview.type';

export function useOverview() {
  const cache = useState<OverviewResponse | null>('overview-cache', () => null);

  const { data, pending, error, refresh } = useApiGet<OverviewResponse>(
    'overview',
    {
      watch: false,
      immediate: false,
    },
  );

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

  const summaryTransactions = computed(() => cache.value?.transactions ?? null);
  const summaryPots = computed(() => cache.value?.pots ?? null);
  const summaryBudgets = computed(() => cache.value?.budgets ?? null);
  const summaryRecurringBills = computed(() => cache.value?.recurringBills ?? null);

  const refreshOverview = async () => {
    cache.value = null;
    await refresh();
  };

  return {
    pending,
    error,

    summaryTransactions,
    summaryPots,
    summaryBudgets,
    recurringBills: summaryRecurringBills,

    refreshOverview,
  };
}
