import { useApiGet } from '~/composables';
import type { OverviewResponse, OverviewTransaction, OverviewPot, OverviewBudget, OverviewRecurringBill } from './overview.type';
import type { FetchError } from 'ofetch';

export function useOverview() {
  const transactions = useState<OverviewTransaction | null>('overview:transactions', () => null);
  const pots = useState<OverviewPot[]>('overview:pots', () => []);
  const budgets = useState<OverviewBudget[]>('overview:budgets', () => []);
  const recurringBills = useState<OverviewRecurringBill[]>('overview:recurringBills', () => []);

  const isLoading = useState<boolean>('overview:isLoading', () => false);

  let overviewData: Ref<OverviewResponse | null>;
  let overviewError: Ref<FetchError<OverviewResponse> | undefined>;
  let refreshApi: (() => Promise<void>) | null = null;

  function assignOverviewData(data: OverviewResponse) {
    transactions.value = data.transactions;
    pots.value = data.pots;
    budgets.value = data.budgets;
    recurringBills.value = data.recurringBills;
  }

  async function loadOverview() {
    isLoading.value = true;

    const result = await useApiGet<OverviewResponse>('overview');
    overviewData = result.data;
    overviewError = result.error;
    refreshApi = result.refresh;

    if (!overviewError.value && overviewData.value) {
      assignOverviewData(overviewData.value);
    }

    isLoading.value = false;
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
    transactions,
    pots,
    budgets,
    recurringBills,
    isLoading,

    loadOverview,
    refreshOverview,
  };
}
