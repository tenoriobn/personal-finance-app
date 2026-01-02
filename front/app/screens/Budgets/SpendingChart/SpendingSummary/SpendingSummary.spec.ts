import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import SpendingSummary from './index.vue';
import type { BudgetData } from '../../budgets.type';

const budgetsMock = ref<BudgetData[]>([]);
const pendingMock = ref(false);

vi.mock('../../useBudgets', () => ({
  useBudgets: () => ({
    budgets: budgetsMock,
    pending: pendingMock,
  }),
}));

const calculateSpentMock = vi.fn();
vi.mock('~/utils/calculations', () => ({
  calculateSpent: (...args: Parameters<typeof calculateSpentMock>) =>
    calculateSpentMock(...args),
}));

const formatCurrencyMock = vi.fn();
vi.mock('~/utils', () => ({
  formatCurrency: (...args: Parameters<typeof formatCurrencyMock>) =>
    formatCurrencyMock(...args),
}));

function makeBudget(overrides?: Partial<BudgetData>): BudgetData {
  return {
    id: 'budget-1',
    maximumSpend: 500,
    category: {
      id: 'category-1',
      name: 'Alimentação',
      budgetId: 'budget-1',
    },
    theme: {
      id: 'theme-1',
      colorName: 'Green',
      colorHex: '#00FF00',
    },
    transactions: [],
    ...overrides,
  };
}

describe('SpendingSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    budgetsMock.value = [];
    pendingMock.value = false;
  });

  it('renders skeleton title when pending', () => {
    pendingMock.value = true;

    const wrapper = mount(SpendingSummary);

    expect(wrapper.find('.animate-pulse').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Resumo de gastos');
  });

  it('renders title when not pending', () => {
    const wrapper = mount(SpendingSummary);

    expect(wrapper.text()).toContain('Resumo de gastos');
  });

  it('renders empty state when there are no budgets', () => {
    const wrapper = mount(SpendingSummary);

    expect(wrapper.text()).toContain('Não há orçamentos.');
  });

  it('renders up to 3 budgets', () => {
    budgetsMock.value = [
      makeBudget({ id: '1' }),
      makeBudget({ id: '2' }),
      makeBudget({ id: '3' }),
      makeBudget({ id: '4' }),
    ];

    calculateSpentMock.mockReturnValue(100);
    formatCurrencyMock.mockReturnValue('R$ 100,00');

    const wrapper = mount(SpendingSummary);
    const rows = wrapper.findAll('tr');

    expect(rows.length).toBe(3);
  });

  it('renders budget category name', () => {
    budgetsMock.value = [
      makeBudget({
        category: { id: 'cat', name: 'Transporte', budgetId: '1' },
      }),
    ];

    calculateSpentMock.mockReturnValue(50);
    formatCurrencyMock.mockReturnValue('R$ 50,00');

    const wrapper = mount(SpendingSummary);

    expect(wrapper.text()).toContain('Transporte');
  });

  it('applies theme color to indicator bar', () => {
    budgetsMock.value = [
      makeBudget({
        theme: {
          id: 'theme',
          colorName: 'Blue',
          colorHex: '#0000FF',
        },
      }),
    ];

    calculateSpentMock.mockReturnValue(80);
    formatCurrencyMock.mockReturnValue('R$ 80,00');

    const wrapper = mount(SpendingSummary);
    const indicator = wrapper.find('span');

    expect(indicator.attributes('style')).toContain('background-color: #0000FF');
  });

  it('calls calculateSpent with budget transactions', () => {
    const transactions = [
      { id: 't1', amount: 40, name: 'A', budgetId: '1', date: '', recurring: false },
    ];

    budgetsMock.value = [
      makeBudget({ transactions }),
    ];

    calculateSpentMock.mockReturnValue(40);
    formatCurrencyMock.mockReturnValue('R$ 40,00');

    mount(SpendingSummary);

    expect(calculateSpentMock).toHaveBeenCalledWith(transactions);
  });

  it('formats spent and maximum values without signal', () => {
    budgetsMock.value = [
      makeBudget({ maximumSpend: 200 }),
    ];

    calculateSpentMock.mockReturnValue(75);
    formatCurrencyMock
      .mockReturnValueOnce('R$ 75,00')
      .mockReturnValueOnce('R$ 200,00');

    mount(SpendingSummary);

    expect(formatCurrencyMock).toHaveBeenNthCalledWith(1, 75, false);
    expect(formatCurrencyMock).toHaveBeenNthCalledWith(2, 200, false);
  });
});
