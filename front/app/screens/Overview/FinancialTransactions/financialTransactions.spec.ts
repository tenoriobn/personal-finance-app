import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import FinancialTransactions from './index.vue';
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
const formatDateMock = vi.fn();

vi.mock('~/utils', () => ({
  formatCurrency: (...args: Parameters<typeof formatCurrencyMock>) =>
    formatCurrencyMock(...args),
  formatDate: (...args: Parameters<typeof formatDateMock>) =>
    formatDateMock(...args),
}));

const globalMountOptions = {
  global: {
    stubs: {
      NuxtLink: {
        template: '<a :href="to"><slot /></a>',
        props: ['to'],
      },
    },
  },
};

function makeSummaryTransactions(
  overrides?: Partial<OverviewTransaction>,
): OverviewTransaction {
  return {
    currentBalance: 0,
    income: 0,
    expenses: 0,
    transactions: [],
    ...overrides,
  };
}

describe('Overview > FinancialTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pendingMock.value = false;
    summaryTransactionsMock.value = null;
  });

  it('Should render section title', () => {
    const wrapper = mount(FinancialTransactions, globalMountOptions);

    expect(wrapper.text()).toContain('Transações');
  });

  it('Should render link to transactions page', () => {
    const wrapper = mount(FinancialTransactions, globalMountOptions);

    const link = wrapper.find('a[href="/transacoes"]');

    expect(link.exists()).toBe(true);
    expect(link.text()).toContain('Ver todos');
  });

  it('Should render skeleton when pending', () => {
    pendingMock.value = true;

    const wrapper = mount(FinancialTransactions, globalMountOptions);

    expect(wrapper.find('.animate-pulse').exists()).toBe(true);
  });

  it('Should render empty state when there are no transactions', () => {
    summaryTransactionsMock.value = makeSummaryTransactions();

    const wrapper = mount(FinancialTransactions, globalMountOptions);

    expect(wrapper.text()).toContain('Não há transações.');
  });

  it('Should render list of transactions', () => {
    summaryTransactionsMock.value = makeSummaryTransactions({
      transactions: [
        {
          id: '1',
          name: 'Mercado',
          amount: -150,
          date: '2024-01-10',
        },
        {
          id: '2',
          name: 'Salário',
          amount: 3000,
          date: '2024-01-05',
        },
      ],
    });

    formatCurrencyMock
      .mockReturnValueOnce('-R$ 150,00')
      .mockReturnValueOnce('R$ 3.000,00');

    formatDateMock
      .mockReturnValueOnce('10/01/2024')
      .mockReturnValueOnce('05/01/2024');

    const wrapper = mount(FinancialTransactions, globalMountOptions);

    expect(wrapper.text()).toContain('Mercado');
    expect(wrapper.text()).toContain('Salário');
  });

  it('Should display first letter of transaction name', () => {
    summaryTransactionsMock.value = makeSummaryTransactions({
      transactions: [
        {
          id: '1',
          name: 'Netflix',
          amount: -55,
          date: '2024-01-01',
        },
      ],
    });

    formatCurrencyMock.mockReturnValue('-R$ 55,00');
    formatDateMock.mockReturnValue('01/01/2024');

    const wrapper = mount(FinancialTransactions, globalMountOptions);

    expect(wrapper.text()).toContain('N');
  });

  it('Should apply green color for positive amounts', () => {
    summaryTransactionsMock.value = makeSummaryTransactions({
      transactions: [
        {
          id: '1',
          name: 'Salário',
          amount: 2000,
          date: '2024-01-01',
        },
      ],
    });

    formatCurrencyMock.mockReturnValue('R$ 2.000,00');
    formatDateMock.mockReturnValue('01/01/2024');

    const wrapper = mount(FinancialTransactions, globalMountOptions);

    expect(wrapper.find('.text-green').exists()).toBe(true);
  });

  it('Should apply red color for negative amounts', () => {
    summaryTransactionsMock.value = makeSummaryTransactions({
      transactions: [
        {
          id: '1',
          name: 'Aluguel',
          amount: -1200,
          date: '2024-01-01',
        },
      ],
    });

    formatCurrencyMock.mockReturnValue('-R$ 1.200,00');
    formatDateMock.mockReturnValue('01/01/2024');

    const wrapper = mount(FinancialTransactions, globalMountOptions);

    expect(wrapper.find('.text-red').exists()).toBe(true);
  });

  it('Should format currency and date correctly', () => {
    summaryTransactionsMock.value = makeSummaryTransactions({
      transactions: [
        {
          id: '1',
          name: 'Luz',
          amount: -200,
          date: '2024-01-15',
        },
      ],
    });

    formatCurrencyMock.mockReturnValue('-R$ 200,00');
    formatDateMock.mockReturnValue('15/01/2024');

    mount(FinancialTransactions, globalMountOptions);

    expect(formatCurrencyMock).toHaveBeenCalledWith(-200);
    expect(formatDateMock).toHaveBeenCalledWith('2024-01-15');
  });
});
