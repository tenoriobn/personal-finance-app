import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TableTransactions from './index.vue';
import type { TableTransactionsProps } from './table.type';
import type { TransactionsData } from '../transactions.type';

vi.mock('~/utils', () => ({
  formatDate: vi.fn((date: string) => `formatted-${date}`),
  formatCurrency: vi.fn((amount: number) =>
    amount > 0 ? `+R$ ${amount},00` : `-R$ ${Math.abs(amount)},00`,
  ),
}));

const mountComponent = (
  props: Partial<TableTransactionsProps> = {},
) => {
  return mount(TableTransactions, {
    props: {
      transactions: [],
      pending: false,
      ...props,
    },
  });
};

describe('TableTransactions', () => {
  describe('Renderização', () => {
    it('Should render table headers correctly', () => {
      const wrapper = mountComponent();

      const headers = wrapper.findAll('th');
      expect(headers).toHaveLength(4);
      expect(headers[0]!.text()).toBe('Destinatário/Remetente');
      expect(headers[1]!.text()).toBe('Categoria');
      expect(headers[2]!.text()).toBe('Data da transação');
      expect(headers[3]!.text()).toBe('Valor');
    });

    it('Should render skeleton when pending is true', () => {
      const wrapper = mountComponent({ pending: true });

      expect(wrapper.findComponent({ name: 'TableSkeleton' }).exists()).toBe(true);
      expect(wrapper.text()).not.toContain('Não há transações.');
    });

    it('Should render empty state when there are no transactions and not pending', () => {
      const wrapper = mountComponent({
        transactions: [],
        pending: false,
      });

      expect(wrapper.text()).toContain('Não há transações.');
    });
  });

  describe('Comportamento com dados', () => {
    const transactionsMock: TransactionsData[] = [
      {
        id: '1',
        name: 'Junior Soares',
        date: '2024-01-10',
        amount: -39.9,
        recurring: false,
        budget: {
          category: {
            id: 'cat-1',
            name: 'Entretenimento',
          },
        },
      },
      {
        id: '2',
        name: 'Savio',
        date: '2024-01-05',
        amount: 2500,
        recurring: true,
        budget: {
          category: {
            id: 'cat-2',
            name: 'Renda',
          },
        },
      },
    ];

    it('Should render a row for each transaction', () => {
      const wrapper = mountComponent({
        transactions: transactionsMock,
      });

      const rows = wrapper.findAll('tbody > tr');
      expect(rows).toHaveLength(2);
    });

    it('Should render avatar with the first letter of the name', () => {
      const wrapper = mountComponent({
        transactions: [transactionsMock[0]!],
      });

      expect(wrapper.find('span.bg-amber-500').text()).toBe('J');
    });

    it('Should render transaction name and category correctly', () => {
      const wrapper = mountComponent({
        transactions: [transactionsMock[0]!],
      });

      expect(wrapper.text()).toContain('Junior Soares');
      expect(wrapper.text()).toContain('Entretenimento');
    });

    it('Should format and display transaction date', () => {
      const wrapper = mountComponent({
        transactions: [transactionsMock[0]!],
      });

      expect(wrapper.text()).toContain('formatted-2024-01-10');
    });

    it('Should format and display positive amount with green color', () => {
      const wrapper = mountComponent({
        transactions: [transactionsMock[1]!],
      });

      const amountCell = wrapper.find('td.text-green');
      expect(amountCell.exists()).toBe(true);
      expect(amountCell.text()).toBe('+R$ 2500,00');
    });

    it('Should format and display negative amount with red color', () => {
      const wrapper = mountComponent({
        transactions: [transactionsMock[0]!],
      });

      const amountCell = wrapper.find('td.text-red');
      expect(amountCell.exists()).toBe(true);
      expect(amountCell.text()).toBe('-R$ 39.9,00');
    });
  });
});
