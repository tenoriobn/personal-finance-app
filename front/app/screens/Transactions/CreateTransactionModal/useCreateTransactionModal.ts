import { computed, reactive, ref, watch } from 'vue';
import { useApiGet, useApiPost, useCurrencyMask, useToast, useRefreshAll } from '~/composables';
import { createTransactionSchema } from './transaction.schema';
import type { CategoryData, TransactionForm } from './createTransactionModal.type';
import type { BudgetData } from '~/screens/Budgets/budgets.type';
import { calculateSpent, calculateRemaining } from '~/utils/calculations';
import { formatCurrency } from '~/utils';

export function useCreateTransactionModal(categories: () => CategoryData[], showModal?: () => void) {
  const { notify } = useToast();
  const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();
  const { refreshOverview, refreshBudgets, refreshBills, refreshTransactions } = useRefreshAll();

  const formState = reactive<TransactionForm>({
    name: '',
    date: '',
    amount: amount.value,
    recurring: false,
    budgetId: '',
    type: 'IN',
  });

  const errors = reactive<Record<string, string>>({
    name: '',
    date: '',
    amount: '',
    budgetId: '',
  });

  const selectedBudget = ref<BudgetData | null>(null);

  const hasAvailableCategories = computed(() => (categories().length ?? 0) > 0);

  const modalIntro = computed(() => {
    if (!hasAvailableCategories.value) {
      return 'Para registrar uma transação, é necessário ter um orçamento criado. Crie um orçamento e vincule-o a uma categoria para começar a acompanhar seus gastos.';
    }

    return 'Selecione uma categoria para vincular essa transação. Assim, você poderá monitorar seus gastos em Orçamentos.';
  });

  watch(() => formState.budgetId, async (id) => {
    errors.budgetId = '';
    selectedBudget.value = null;

    if (!id) {
      return;
    }

    const result = await useApiGet<BudgetData>(`budgets/${id}`, {}, false);

    if (result && !('data' in result)) {
      selectedBudget.value = result;
      return;
    }

    selectedBudget.value = result.data.value ?? null;
  });

  const buildPayload = () => ({
    ...formState,
    name: formState.name.trim(),
    amount: formState.type === 'OUT' ? -Math.abs(amount.value) : Math.abs(amount.value),
  });

  const validateAndSetErrors = (): boolean => {
    const payload = buildPayload();

    Object.keys(errors).forEach(k => (errors[k] = ''));

    const parsed = createTransactionSchema.safeParse(payload);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (key in errors) {
          errors[key] = issue.message;
        }
      });
      return false;
    }

    if (!selectedBudget.value) {
      return true;
    }

    const { transactions = [], maximumSpend = 0 } = selectedBudget.value;

    const spent = calculateSpent(transactions);
    const free = calculateRemaining(transactions, maximumSpend);
    const value = payload.amount;

    if (value < 0) {
      if (spent <= 0) {
        errors.amount = 'Este orçamento não possui saldo para retirar.';
        return false;
      }

      const maxWithdraw = spent;

      if (Math.abs(value) > maxWithdraw) {
        errors.amount = `Saldo insuficiente. Máximo para retirar: ${formatCurrency(maxWithdraw, false)}`;
        return false;
      }
    }

    if (value > 0) {
      if (value > free) {
        errors.amount = `Este valor excede o limite do orçamento. Máximo disponível para adicionar: ${formatCurrency(free, false)}`;
        return false;
      }
    }

    return true;
  };

  const isSubmitting = ref(false);

  const resetForm = () => {
    Object.assign(formState, {
      name: '',
      date: '',
      amount: amount.value,
      recurring: false,
      budgetId: '',

      type: 'IN',
    });
    amount.value = 0;
    Object.keys(errors).forEach(k => (errors[k] = ''));
  };

  const refreshPages = () => {
    refreshOverview();
    refreshBudgets();
    refreshBills();
    refreshTransactions();
  };

  const handleSubmit = async () => {
    if (isSubmitting.value || !validateAndSetErrors()) {
      return;
    }

    isSubmitting.value = true;

    try {
      const payload = buildPayload();
      await useApiPost('transactions', payload);
      notify('success', 'Transação criada com sucesso!');
      refreshPages();
      resetForm();
      showModal?.();
    }
    finally {
      isSubmitting.value = false;
    }
  };

  return {
    formState,
    errors,
    isSubmitting,
    formattedAmount,
    onInput,
    onKeyDown,
    onPaste,
    hasAvailableCategories,
    modalIntro,
    handleSubmit,
    selectedBudget,
    categoryOptions: computed(() => categories().map(category => ({
      id: category.budgetId,
      name: category.name,
    }))),
  };
}
