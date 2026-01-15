import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useDeleteBudgetModal } from './useDeleteBudgetModal';
import type { BudgetData } from '../budgets.type';

const deleteMock = vi.fn();
const notifyMock = vi.fn();
const refreshCategoriesAndThemes = vi.fn();
const refreshAfterBudgetMock = vi.fn();

vi.mock('~/composables', () => ({
  useApiDelete: (endpoint: string) => deleteMock(endpoint),

  useToast: () => ({
    notify: notifyMock,
  }),

  useRefreshAll: () => ({
    refreshAfterBudget: refreshAfterBudgetMock,
  }),
}));

vi.mock('../useCategoriesAndThemes', () => ({
  useCategoriesAndThemes: () => ({
    refreshCategoriesAndThemes,
  }),
}));

function createBudget(): BudgetData {
  return {
    id: 'budget-1',
    maximumSpend: 500,
    category: {
      id: 'cat-1',
      name: 'Supermercado',
      budgetId: 'budget-1',
    },
    theme: {
      id: 'theme-1',
      colorName: 'Red',
      colorHex: '#ff0000',
    },
    transactions: [],
  };
}

describe('useDeleteBudgetModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should not submit when budget is null', async () => {
    const budget = ref<BudgetData | null>(null);
    const onSuccess = vi.fn();

    const { handleSubmit } = useDeleteBudgetModal(budget, onSuccess);

    await handleSubmit();

    expect(deleteMock).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('Should delete budget successfully', async () => {
    const budget = ref<BudgetData | null>(createBudget());
    const onSuccess = vi.fn();

    const { handleSubmit, isSubmitting } = useDeleteBudgetModal(
      budget,
      onSuccess,
    );

    await handleSubmit();

    expect(deleteMock).toHaveBeenCalledWith('budgets/budget-1');
    expect(refreshAfterBudgetMock).toHaveBeenCalledTimes(1);
    expect(refreshCategoriesAndThemes).toHaveBeenCalled();
    expect(notifyMock).toHaveBeenCalledWith(
      'error',
      'Orçamento deletado com sucesso!',
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(isSubmitting.value).toBe(false);
  });
});
