import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import SpendingSummary from './index.vue';
import type { OverviewBudget } from '../../overview.type';

const summaryBudgetsMock = ref<OverviewBudget[] | null>(null);
const pendingMock = ref(false);

vi.mock('../../useOverview', () => ({
  useOverview: () => ({
    summaryBudgets: summaryBudgetsMock,
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

function makeBudget(overrides?: Partial<OverviewBudget>): OverviewBudget {
  return {
    id: 'budget-1',
    maximumSpend: 500,
    category: {
      id: 'category-1',
      name: 'Alimentação',
    },
    theme: {
      colorName: 'Green',
      colorHex: '#00FF00',
    },
    transactions: [],
    ...overrides,
  };
}

describe('Overview > FinancialBudgets > SpendingSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    summaryBudgetsMock.value = null;
    pendingMock.value = false;
  });

  it('Should render skeleton when pending', () => {
    pendingMock.value = true;

    const wrapper = mount(SpendingSummary);

    expect(wrapper.findComponent({ name: 'SpendingSummarySkeleton' }).exists()).toBe(true);
  });

  it('Should render up to 4 budgets', () => {
    summaryBudgetsMock.value = [
      makeBudget({ id: '1' }),
      makeBudget({ id: '2' }),
      makeBudget({ id: '3' }),
      makeBudget({ id: '4' }),
      makeBudget({ id: '5' }),
    ];

    calculateSpentMock.mockReturnValue(100);
    formatCurrencyMock.mockReturnValue('R$ 100,00');

    const wrapper = mount(SpendingSummary);
    const articles = wrapper.findAll('article');

    expect(articles.length).toBe(4);
  });

  it('Should render budget category name', () => {
    summaryBudgetsMock.value = [
      makeBudget({
        category: {
          id: 'cat-1',
          name: 'Transporte',
        },
      }),
    ];

    calculateSpentMock.mockReturnValue(50);
    formatCurrencyMock.mockReturnValue('R$ 50,00');

    const wrapper = mount(SpendingSummary);

    expect(wrapper.text()).toContain('Transporte');
  });

  it('Should apply theme color to indicator bar', () => {
    summaryBudgetsMock.value = [
      makeBudget({
        theme: {
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

  it('Should call calculateSpent with budget transactions', () => {
    const transactions = [
      { id: 't1', amount: 40, name: 'A', budgetId: '1', date: '', recurring: false },
    ];

    summaryBudgetsMock.value = [
      makeBudget({ transactions }),
    ];

    calculateSpentMock.mockReturnValue(40);
    formatCurrencyMock.mockReturnValue('R$ 40,00');

    mount(SpendingSummary);

    expect(calculateSpentMock).toHaveBeenCalledWith(transactions);
  });

  it('Should format spent value without signal', () => {
    summaryBudgetsMock.value = [
      makeBudget(),
    ];

    calculateSpentMock.mockReturnValue(75);
    formatCurrencyMock.mockReturnValue('R$ 75,00');

    mount(SpendingSummary);

    expect(formatCurrencyMock).toHaveBeenCalledWith(75, false);
  });
});
