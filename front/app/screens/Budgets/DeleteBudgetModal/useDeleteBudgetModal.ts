import { useApiDelete, useToast } from '~/composables';
import { useCategoriesAndThemes } from '../useCategoriesAndThemes';
import type { BudgetData } from '../budgets.type';

export function useDeleteBudgetModal(budget: Ref<BudgetData | null>, onSuccess: () => void) {
  const isSubmitting = ref(false);
  const { notify } = useToast();
  const { refreshCategoriesAndThemes } = useCategoriesAndThemes();

  const handleSubmit = async () => {
    if (isSubmitting.value || !budget.value) {
      return;
    }

    isSubmitting.value = true;

    try {
      await useApiDelete(`budgets/${budget.value.id}`);

      notify('error', 'Orçamento deletado com sucesso!');
      refreshCategoriesAndThemes();
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
