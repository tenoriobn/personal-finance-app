import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useCreateBudgetModal } from './index';

const postMock = vi.fn();
const notifyMock = vi.fn();
const refreshMock = vi.fn();

vi.mock('~/composables', () => ({
  useApiPost: (
    endpoint: string,
    body: {
      maximumSpend: number
      categoryId: string
      themeId: string
      userId: string
    },
    options?: Record<string, unknown>,
  ) => postMock(endpoint, body, options),

  useToast: () => ({
    notify: notifyMock,
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

vi.mock('../../useCategoriesAndThemes', () => ({
  useCategoriesAndThemes: () => ({
    categories: ref([{ id: 'cat-1', name: 'Supermercado' }]),
    themes: ref([{ id: 'theme-1', colorName: 'Red', colorHex: '#ff0000' }]),
    refreshCategoriesAndThemes: refreshMock,
  }),
}));

describe('useCreateBudgetModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should expose available categories', () => {
    const { hasAvailableCategories } = useCreateBudgetModal();

    expect(hasAvailableCategories.value).toBe(true);
  });

  it('Should return correct intro text when categories exist', () => {
    const { modalIntro } = useCreateBudgetModal();

    expect(modalIntro.value).toContain(
      'Ao criar um orçamento e estabelecer um limite de gastos',
    );
  });

  it('Should submit budget successfully', async () => {
    const { formState, handleSubmit } = useCreateBudgetModal();

    formState.categoryId = 'cat-1';
    formState.themeId = 'theme-1';
    formState.maximumSpend = 100;

    await nextTick();

    await handleSubmit();

    expect(postMock).toHaveBeenCalledWith(
      'budgets',
      expect.objectContaining({
        maximumSpend: 100,
        categoryId: 'cat-1',
        themeId: 'theme-1',
        userId: expect.any(String),
      }),
      undefined,
    );

    expect(refreshMock).toHaveBeenCalled();
    expect(notifyMock).toHaveBeenCalled();
  });
});
