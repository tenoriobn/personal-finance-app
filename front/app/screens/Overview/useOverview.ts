import { useApiGet } from '~/composables';
import { computed } from 'vue';
import type { OverviewResponse } from './overview.type';

export function useOverview() {
  const { data, pending, error, refresh } = useApiGet<OverviewResponse>('overview');

  const summaryTransactions = computed(() => data.value?.transactions || null);
  const summaryPots = computed(() => data.value?.pots || null);
  const summaryBudgets = computed(() => data.value?.budgets || null);
  const summaryRecurringBills = computed(() => data.value?.recurringBills || null);

  return {
    pending,
    error,

    summaryTransactions,
    summaryPots,
    summaryBudgets,
    recurringBills: summaryRecurringBills,

    refreshOverview: refresh,
  };
}
