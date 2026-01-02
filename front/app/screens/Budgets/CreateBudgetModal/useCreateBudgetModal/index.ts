import { computed, reactive, ref, watch } from 'vue';
import { useApiPost, useCurrencyMask, useToast } from '~/composables';
import { useCategoriesAndThemes } from '../../useCategoriesAndThemes';
import type { BudgetForm } from '../../budgets.type';
import { baseBudgetSchema } from '../../budget.schema';

export function useCreateBudgetModal(onSuccess?: () => void) {
  const { notify } = useToast();
  const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();
  const { categories, themes, refreshCategoriesAndThemes } = useCategoriesAndThemes();

  const hasAvailableCategories = computed(() =>
    (categories.value?.length ?? 0) > 0,
  );

  const modalIntro = computed(() => {
    if (!hasAvailableCategories.value) {
      return `Você já criou orçamentos para todas as categorias disponíveis.
        Para criar um novo orçamento, exclua um orçamento que não esteja mais em uso e reaproveite a categoria correspondente.
      `;
    }

    return 'Ao criar um orçamento e estabelecer um limite de gastos, você poderá acompanhar melhor como utiliza seu dinheiro.';
  });

  const defaultForm: BudgetForm = {
    maximumSpend: amount.value,
    categoryId: '',
    themeId: '',
    userId: '68cc2ec3f0818350607a26b6',
  };

  const formState = reactive({ ...defaultForm });

  const errors = reactive<Record<string, string>>({
    maximumSpend: '',
    categoryId: '',
    themeId: '',
  });

  watch(amount, () => (errors.maximumSpend = ''));
  watch(() => formState.categoryId, () => (errors.categoryId = ''));
  watch(() => formState.themeId, () => (errors.themeId = ''));

  function resetForm() {
    Object.assign(formState, { ...defaultForm });
    amount.value = 0;
    Object.keys(errors).forEach(k => (errors[k] = ''));
  }

  function validate(): boolean {
    Object.keys(errors).forEach(k => (errors[k] = ''));

    const parsed = baseBudgetSchema.safeParse({
      ...formState,
      maximumSpend: amount.value,
    });

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (errors[key] !== undefined) {
          errors[key] = issue.message;
        }
      });
      return false;
    }

    return true;
  }

  const isSubmitting = ref(false);

  async function handleSubmit() {
    if (!hasAvailableCategories.value) {
      return;
    }
    if (isSubmitting.value || !validate()) {
      return;
    }

    isSubmitting.value = true;

    try {
      await useApiPost('budgets', {
        ...formState,
        maximumSpend: amount.value,
      });

      refreshCategoriesAndThemes();
      notify('success', 'Orçamento criado com sucesso!');
      resetForm();
      onSuccess?.();
    }
    finally {
      isSubmitting.value = false;
    }
  }

  return {
    formState,
    errors,
    isSubmitting,

    hasAvailableCategories,
    modalIntro,

    formattedAmount,
    onInput,
    onKeyDown,
    onPaste,

    categories,
    themes,

    handleSubmit,
  };
}
