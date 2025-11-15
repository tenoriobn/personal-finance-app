import { useApiGet } from '~/composables';
import type { BudgetData } from './budgets.type';
import type { FetchError } from 'ofetch';

export function useBudgets() {
  const budgets = useState<BudgetData[]>('budgets', () => []);
  const pending = ref(false);

  let data: Ref<BudgetData[] | null>;
  let error: Ref<FetchError<BudgetData[]> | undefined>;
  let refresh: () => Promise<void>;

  async function getBudgets() {
    pending.value = true;

    ({ data, error, refresh } = await useApiGet<BudgetData[]>('budgets'));

    if (!refresh) {
      return;
    }

    if (!error.value && data.value) {
      budgets.value = data.value;
    }

    pending.value = false;
  }

  async function refreshBudgets() {
    if (!refresh) {
      return;
    }

    await refresh();

    if (!error.value && data.value) {
      budgets.value = data.value;
    }
  }

  return {
    budgets,
    getBudgets,
    refreshBudgets,
    pending,
  };
}
