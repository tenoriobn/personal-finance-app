import { useOverview } from '~/screens/Overview/useOverview';
import { useTransactions } from '~/screens/Transactions/useTransactions';
import { useBudgets } from '~/screens/Budgets/useBudgets';
import { usePots } from '~/screens/Pots/usePots';
import { useRecurringBills } from '~/screens/RecurringBills/useRecurringBills';

export function useRefreshAll() {
  const { refreshOverview } = useOverview();
  const { refreshBudgets } = useBudgets();
  const { refreshBills } = useRecurringBills();
  const { refreshTransactions } = useTransactions();
  const { refreshPots } = usePots();

  return {
    refreshAfterTransaction: () => {
      refreshOverview();
      refreshBudgets();
      refreshBills();
      refreshTransactions();
    },

    refreshAfterBudget: () => {
      refreshOverview();
      refreshTransactions();
      refreshBudgets();
      refreshBills();
    },

    refreshAfterPot: () => {
      refreshOverview();
      refreshPots();
    },

    refreshAfterBill: () => {
      refreshOverview();
      refreshBills();
    },
  };
}
