import { useApiDelete, useToast, useRefreshAll } from '~/composables';
import { useCategoriesAndThemes } from '../useCategoriesAndThemes';
import type { BudgetData } from '../budgets.type';

export function useDeleteBudgetModal(budget: Ref<BudgetData | null>, onSuccess: () => void) {
  const isSubmitting = ref(false);
  const { notify } = useToast();
  const { refreshCategoriesAndThemes } = useCategoriesAndThemes();
  const { refreshOverview, refreshBudgets, refreshTransactions } = useRefreshAll();

  const refreshDataPages = () => {
    refreshOverview();
    refreshBudgets();
    refreshTransactions();
    refreshCategoriesAndThemes();
  };

  const handleSubmit = async () => {
    if (isSubmitting.value || !budget.value) {
      return;
    }

    isSubmitting.value = true;

    try {
      await useApiDelete(`budgets/${budget.value.id}`);
      refreshDataPages();
      notify('error', 'Orçamento deletado com sucesso!');
      onSuccess();
    }
    finally {
      isSubmitting.value = false;
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
