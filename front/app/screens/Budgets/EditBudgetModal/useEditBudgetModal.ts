import { computed, reactive, ref, watch } from 'vue';
import { useApiPut, useCurrencyMask, useToast, useRefreshAll } from '~/composables';
import { useCategoriesAndThemes } from '../useCategoriesAndThemes';
import type { BudgetData, BudgetForm } from '../budgets.type';
import { baseBudgetSchema } from '../budget.schema';
import { calculateSpent } from '~/utils/calculations';

export function useEditBudgetModal(budget: () => BudgetData | null, onSuccess?: () => void) {
  const { notify } = useToast();
  const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();
  const { categories, themes, refreshCategoriesAndThemes } = useCategoriesAndThemes();
  const { refreshOverview, refreshBudgets, refreshTransactions } = useRefreshAll();

  const spent = computed(() => {
    const current = budget();
    if (!current) {
      return 0;
    }

    return calculateSpent(current.transactions ?? []);
  });

  const formState = reactive<BudgetForm>({
    maximumSpend: 0,
    categoryId: '',
    themeId: '',
  });

  const errors = reactive<Record<string, string>>({
    maximumSpend: '',
    categoryId: '',
    themeId: '',
  });

  function resetErrors() {
    Object.keys(errors).forEach(k => (errors[k] = ''));
  }

  function initFormFromBudget() {
    const current = budget();
    if (!current) {
      amount.value = 0;
      formState.categoryId = '';
      formState.themeId = '';
      return;
    }

    amount.value = Number(current.maximumSpend);
    formState.categoryId = current.category.id;
    formState.themeId = current.theme.id;
  }

  watch(
    budget,
    () => initFormFromBudget(),
    { immediate: true },
  );

  const categoryOptions = computed(() => {
    if (!categories.value) {
      return [];
    }

    const opts = categories.value.map(c => ({
      id: c.id,
      name: c.name,
    }));

    const current = budget();
    if (current?.category && !opts.some(o => o.id === current.category.id)) {
      opts.unshift({
        id: current.category.id,
        name: current.category.name,
      });
    }

    return opts;
  });

  const themeOptions = computed(() => {
    if (!themes.value) {
      return [];
    }

    const opts = themes.value.map(t => ({
      id: t.id,
      name: t.colorName,
      colorHex: t.colorHex,
    }));

    const current = budget();
    if (current?.theme && !opts.some(o => o.id === current.theme.id)) {
      opts.unshift({
        id: current.theme.id,
        name: current.theme.colorName,
        colorHex: current.theme.colorHex,
      });
    }

    return opts;
  });

  function validate(): boolean {
    resetErrors();

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

    const spentValue = spent.value;
    const newMaximum = amount.value;

    if (newMaximum < spentValue) {
      errors.maximumSpend = `Este orçamento já possui ${formatCurrency(spentValue, false)} 
      gastos. O valor máximo não pode ser menor que isso.`;
      return false;
    }

    return true;
  }

  const isSubmitting = ref(false);

  const refreshDataPages = () => {
    refreshOverview();
    refreshBudgets();
    refreshTransactions();
    refreshCategoriesAndThemes();
  };

  async function handleSubmit() {
    const current = budget();
    if (!current) {
      return;
    }
    if (isSubmitting.value || !validate()) {
      return;
    }

    isSubmitting.value = true;

    try {
      await useApiPut(`budgets/${current.id}`, {
        maximumSpend: amount.value,
        categoryId: formState.categoryId,
        themeId: formState.themeId,
      });

      notify('success', 'Orçamento atualizado com sucesso!');
      refreshDataPages();
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
    resetErrors,

    formattedAmount,
    onInput,
    onKeyDown,
    onPaste,

    categoryOptions,
    themeOptions,

    initFormFromBudget,
    handleSubmit,
  };
}
