import { useApiDelete, useToast, useRefreshAll } from '~/composables';
import { useCategoriesAndThemes } from '../useCategoriesAndThemes';
import type { BudgetData } from '../budgets.type';

export function useDeleteBudgetModal(budget: Ref<BudgetData | null>, showModal: () => void) {
  const isSubmitting = ref(false);
  const { notify } = useToast();
  const { refreshCategoriesAndThemes } = useCategoriesAndThemes();
  const { refreshAfterBudget } = useRefreshAll();

  const handleSubmit = async () => {
    if (isSubmitting.value || !budget.value) {
      return;
    }

    isSubmitting.value = true;

    try {
      await useApiDelete(`budgets/${budget.value.id}`);

      refreshAfterBudget();
      refreshCategoriesAndThemes();

      notify('error', 'Orçamento deletado com sucesso!');
      showModal();
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
