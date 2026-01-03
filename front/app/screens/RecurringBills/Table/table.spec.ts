import { describe, it, vi, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Table from './index.vue';
import type { RecurringBillsTableProps } from './table.type';

vi.mock('~/utils', () => ({
  formatMonthDay: () => 'Jan - 03',
  formatCurrency: (value: number) => `R$ ${value},00`,
}));

describe('RecurringBills > Table', () => {
  const factory = (props: RecurringBillsTableProps) =>
    mount(Table, {
      props,
      global: {
        stubs: {
          TableSkeleton: true,
          BillPaidIcon: {
            template: '<svg data-testid="bill-paid-icon" />',
          },
          BillDueIcon: {
            template: '<svg data-testid="bill-due-icon" />',
          },
        },
      },
    });

  it('Should render table headers correctly', () => {
    const wrapper = factory({
      recurringBills: [],
      pending: false,
    });

    expect(wrapper.text()).toContain('Destinatário/Remetente');
    expect(wrapper.text()).toContain('Data de vencimento');
    expect(wrapper.text()).toContain('Valor');
  });

  it('Should render skeleton when pending is true', () => {
    const wrapper = factory({
      recurringBills: [],
      pending: true,
    });

    expect(wrapper.findComponent({ name: 'TableSkeleton' }).exists()).toBe(true);
  });

  it('Should render empty state when there are no recurring bills', () => {
    const wrapper = factory({
      recurringBills: [],
      pending: false,
    });

    expect(wrapper.text()).toContain('Não há transações.');
  });

  it('Should render recurring bills rows correctly', () => {
    const wrapper = factory({
      pending: false,
      recurringBills: [
        {
          id: '1',
          name: 'Netflix',
          date: '2025-01-03',
          amount: 50,
          status: 'paid',
        },
      ],
    });

    expect(wrapper.text()).toContain('Netflix');
    expect(wrapper.text()).toContain('N');
    expect(wrapper.text()).toContain('Jan - 03');
    expect(wrapper.text()).toContain('R$ 50,00');
  });

  it('Should render paid icon when status is paid', () => {
    const wrapper = factory({
      pending: false,
      recurringBills: [
        {
          id: '1',
          name: 'Spotify',
          date: '2025-01-03',
          amount: 30,
          status: 'paid',
        },
      ],
    });

    expect(wrapper.find('[data-testid="bill-paid-icon"]').exists()).toBe(true);
  });

  it('Should render due icon when status is dueSoon', () => {
    const wrapper = factory({
      pending: false,
      recurringBills: [
        {
          id: '1',
          name: 'Aluguel',
          date: '2025-01-03',
          amount: 1200,
          status: 'dueSoon',
        },
      ],
    });

    expect(wrapper.find('[data-testid="bill-due-icon"]').exists()).toBe(true);
  });

  it('Should apply red text color when amount is negative', () => {
    const wrapper = factory({
      pending: false,
      recurringBills: [
        {
          id: '1',
          name: 'Reembolso',
          date: '2025-01-03',
          amount: -100,
          status: 'paid',
        },
      ],
    });

    expect(wrapper.find('td.text-red').exists()).toBe(true);
  });
});
