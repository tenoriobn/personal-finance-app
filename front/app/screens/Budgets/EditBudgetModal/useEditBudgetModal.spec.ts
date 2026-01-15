import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { useEditBudgetModal } from './useEditBudgetModal';
import type { BudgetData } from '../budgets.type';

const putMock = vi.fn();
const notifyMock = vi.fn();
const refreshCategoriesAndThemes = vi.fn();
const refreshAfterBudgetMock = vi.fn();

vi.mock('~/composables', () => ({
  useApiPut: (
    endpoint: string,
    body: {
      maximumSpend: number
      categoryId: string
      themeId: string
    },
    options?: Record<string, unknown>,
  ) => putMock(endpoint, body, options),

  useToast: () => ({
    notify: notifyMock,
  }),

  useRefreshAll: () => ({
    refreshAfterBudget: refreshAfterBudgetMock,
  }),

  useCurrencyMask: () => {
    const amount = ref(100);
    return {
      amount,
      formattedAmount: 'R$ 100,00',
      onInput: vi.fn(),
      onKeyDown: vi.fn(),
      onPaste: vi.fn(),
    };
  },
}));

vi.mock('../useCategoriesAndThemes', () => ({
  useCategoriesAndThemes: () => ({
    categories: ref([
      { id: 'cat-1', name: 'Supermercado' },
    ]),
    themes: ref([
      { id: 'theme-1', colorName: 'Red', colorHex: '#ff0000' },
    ]),
    refreshCategoriesAndThemes,
  }),
}));

vi.mock('~/utils/calculations', () => ({
  calculateSpent: () => 50,
}));

function createBudget(): BudgetData {
  return {
    id: 'budget-1',
    maximumSpend: 100,
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

describe('useEditBudgetModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should initialize form from budget', () => {
    const budget = ref<BudgetData | null>(createBudget());

    const { formState } = useEditBudgetModal(() => budget.value);

    expect(formState.categoryId).toBe('cat-1');
    expect(formState.themeId).toBe('theme-1');
  });

  it('Should reset errors', () => {
    const { errors, resetErrors } = useEditBudgetModal(() => null);

    errors.maximumSpend = 'Erro';

    resetErrors();

    expect(errors.maximumSpend).toBe('');
  });

  it('Should submit edit successfully', async () => {
    const budget = ref<BudgetData | null>(createBudget());
    const onSuccess = vi.fn();

    const { formState, handleSubmit } = useEditBudgetModal(
      () => budget.value,
      onSuccess,
    );

    formState.categoryId = 'cat-1';
    formState.themeId = 'theme-1';

    await nextTick();
    await handleSubmit();

    expect(putMock).toHaveBeenCalledWith(
      'budgets/budget-1',
      {
        maximumSpend: 100,
        categoryId: 'cat-1',
        themeId: 'theme-1',
      },
      undefined,
    );
    expect(refreshAfterBudgetMock).toHaveBeenCalledTimes(1);
    expect(refreshCategoriesAndThemes).toHaveBeenCalled();
    expect(notifyMock).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });
});
