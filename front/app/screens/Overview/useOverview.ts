import { useApiGet } from '~/composables';
import type { OverviewResponse, OverviewTransaction, OverviewPot, OverviewBudget, OverviewRecurringBill } from './overview.type';
import type { FetchError } from 'ofetch';

export function useOverview() {
  const summaryTransactions = useState<OverviewTransaction | null>('overview:transactions', () => null);
  const summaryPots = useState<OverviewPot | null>('overview:pots', () => null);
  const summaryBudgets = useState<OverviewBudget | null>('overview:budgets', () => null);
  const summaryRecurringBills = useState<OverviewRecurringBill | null>('overview:recurringBills', () => null);

  const pending = ref(false);

  let overviewData: Ref<OverviewResponse | null>;
  let overviewError: Ref<FetchError<OverviewResponse> | undefined>;
  let refreshApi: (() => Promise<void>) | null = null;

  function assignOverviewData(data: OverviewResponse) {
    summaryTransactions.value = data.transactions;
    summaryPots.value = data.pots;
    summaryBudgets.value = data.budgets;
    summaryRecurringBills.value = data.recurringBills;
  }

  async function loadOverview() {
    pending.value = true;

    const result = await useApiGet<OverviewResponse>('overview');
    overviewData = result.data;
    overviewError = result.error;
    refreshApi = result.refresh;

    if (!overviewError.value && overviewData.value) {
      assignOverviewData(overviewData.value);
    }

    pending.value = false;
  }

  async function refreshOverview() {
    if (!refreshApi) {
      return;
    }

    await refreshApi();

    if (!overviewError.value && overviewData.value) {
      assignOverviewData(overviewData.value);
    }
  }

  return {
    summaryTransactions,
    summaryPots,
    summaryBudgets,
    recurringBills: summaryRecurringBills,
    pending,

    loadOverview,
    refreshOverview,
  };
}
