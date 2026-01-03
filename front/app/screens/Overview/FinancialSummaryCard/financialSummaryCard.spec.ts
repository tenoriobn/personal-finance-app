import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import FinancialSummaryCard from './index.vue';
import type { OverviewTransaction } from '../overview.type';

const summaryTransactionsMock = ref<OverviewTransaction | null>(null);

const pendingMock = ref(false);

vi.mock('../useOverview', () => ({
  useOverview: () => ({
    summaryTransactions: summaryTransactionsMock,
    pending: pendingMock,
  }),
}));

const formatCurrencyMock = vi.fn();

vi.mock('~/utils', () => ({
  formatCurrency: (...args: Parameters<typeof formatCurrencyMock>) =>
    formatCurrencyMock(...args),
}));

describe('Overview > FinancialSummaryCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pendingMock.value = false;
    summaryTransactionsMock.value = null;
  });

  it('Should render all summary labels', () => {
    const wrapper = mount(FinancialSummaryCard);

    expect(wrapper.text()).toContain('Saldo Atual');
    expect(wrapper.text()).toContain('Entradas');
    expect(wrapper.text()).toContain('Saídas');
  });

  it('Should render skeletons when pending', () => {
    pendingMock.value = true;

    const wrapper = mount(FinancialSummaryCard);

    const skeletons = wrapper.findAll('.animate-pulse');

    expect(skeletons.length).toBe(3);
  });

  it('Should format values when not pending', () => {
    summaryTransactionsMock.value = {
      currentBalance: 1000,
      income: 500,
      expenses: 300,
      transactions: [],
    };

    formatCurrencyMock.mockReturnValue('R$ 0,00');

    mount(FinancialSummaryCard);

    expect(formatCurrencyMock).toHaveBeenCalledWith(1000, false);
    expect(formatCurrencyMock).toHaveBeenCalledWith(500, false);
    expect(formatCurrencyMock).toHaveBeenCalledWith(300, false);
  });

  it('Should apply dark background only to first card', () => {
    summaryTransactionsMock.value = {
      currentBalance: 100,
      income: 50,
      expenses: 25,
      transactions: [],
    };

    formatCurrencyMock.mockReturnValue('R$ 0,00');

    const wrapper = mount(FinancialSummaryCard);
    const articles = wrapper.findAll('article');

    expect(articles[0]!.classes()).toContain('bg-grey-900');
    expect(articles[1]!.classes()).toContain('bg-white');
    expect(articles[2]!.classes()).toContain('bg-white');
  });

  it('Should fallback to zero when summaryTransactions is null', () => {
    formatCurrencyMock.mockReturnValue('R$ 0,00');

    mount(FinancialSummaryCard);

    expect(formatCurrencyMock).toHaveBeenCalledWith(0, false);
  });
});
