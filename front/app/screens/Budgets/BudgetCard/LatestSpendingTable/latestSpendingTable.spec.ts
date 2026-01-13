import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import LatestSpendingTable from './index.vue';
import type { TransactionBudget } from '../../budgets.type';

vi.mock('~/utils', () => ({
  formatCurrency: vi.fn((value: number) => `formatted-${value}`),
  formatDate: vi.fn((date: string) => `formatted-date-${date}`),
}));

vi.mock('~/composables', () => ({
  useTransactionsFilters: () => ({
    selectedCategory: { value: '' },
  }),
  useAvatar: (name: string) => ({
    letter: name.charAt(0),
    bgColor: 'bg-gray',
    textColor: 'text-white',
  }),
}));

const normalizeTransactions = (
  transactions: Partial<TransactionBudget>[] = [],
): TransactionBudget[] =>
  transactions.map((transaction, index) => ({
    id: transaction.id ?? `transaction-${index}`,
    name: transaction.name ?? 'Transaction',
    amount: transaction.amount ?? 0,
    date: transaction.date ?? '2025-01-01',
    budgetId: transaction.budgetId ?? 'budget-1',
    recurring: transaction.recurring ?? false,
  }));

const mountComponent = (
  props: {
    transactions?: Partial<TransactionBudget>[]
    categoryId?: string
  } = {},
) =>
  mount(LatestSpendingTable, {
    props: {
      transactions: normalizeTransactions(props.transactions),
      categoryId: props.categoryId ?? 'category-1',
    },
    global: {
      stubs: {
        NuxtLink: RouterLinkStub,
        CaretDownIcon: true,
      },
    },
  });

describe('LatestSpendingTable', () => {
  describe('Render', () => {
    it('Should render table title', () => {
      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Últimos gastos');
    });

    it('Should render empty state message when there are no transactions', () => {
      const wrapper = mountComponent({ transactions: [] });

      expect(wrapper.text()).toContain('Não há transações.');
    });
  });

  describe('Transactions list', () => {
    const transactionsMock = [
      { id: '1', name: 'Supermercado', amount: -120, date: '2025-01-01' },
      { id: '2', name: 'Restaurante', amount: 80, date: '2025-01-02' },
    ];

    it('Should render transaction name and first letter avatar', () => {
      const wrapper = mountComponent({ transactions: transactionsMock });

      expect(wrapper.text()).toContain('Supermercado');
      expect(wrapper.text()).toContain('S');
      expect(wrapper.text()).toContain('Restaurante');
      expect(wrapper.text()).toContain('R');
    });

    it('Should render formatted transaction amount and date', () => {
      const wrapper = mountComponent({ transactions: transactionsMock });

      expect(wrapper.text()).toContain('formatted--120');
      expect(wrapper.text()).toContain('formatted-80');
      expect(wrapper.text()).toContain('formatted-date-2025-01-01');
      expect(wrapper.text()).toContain('formatted-date-2025-01-02');
    });

    it('Should apply red text color for negative amounts', () => {
      const wrapper = mountComponent({ transactions: transactionsMock });

      const negativeAmount = wrapper.findAll('td').find(td =>
        td.text().includes('formatted--120'),
      );

      expect(negativeAmount?.classes()).toContain('text-red');
    });

    it('Should apply green text color for positive amounts', () => {
      const wrapper = mountComponent({ transactions: transactionsMock });

      const positiveAmount = wrapper.findAll('td').find(td =>
        td.text().includes('formatted-80'),
      );

      expect(positiveAmount?.classes()).toContain('text-green');
    });
  });
});
