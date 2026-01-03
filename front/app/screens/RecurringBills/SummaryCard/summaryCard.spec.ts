import { describe, it, vi, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SummaryCard from './index.vue';
import type { SummaryCardProps } from './summaryCard.type';

vi.mock('~/utils', () => ({
  formatCurrency: (value: number) => `R$ ${value}`,
}));

describe('SummaryCard', () => {
  const factory = (props: SummaryCardProps) =>
    mount(SummaryCard, {
      props,
      global: {
        stubs: {
          RecurringBillsIcon: true,
        },
      },
    });

  it('Should render main title correctly', () => {
    const wrapper = factory({
      summary: {
        totalBills: 100,
        paidBills: 50,
        dueSoon: 30,
        upcoming: 20,
      },
      pending: false,
    });

    expect(wrapper.text()).toContain('Total de contas');
    expect(wrapper.text()).toContain('Resumo');
  });

  it('Should show skeleton loaders when pending is true', () => {
    const wrapper = factory({
      pending: true,
    });

    const skeletons = wrapper.findAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('Should render total bills value when not pending', () => {
    const wrapper = factory({
      summary: {
        totalBills: 1000,
        paidBills: 0,
        dueSoon: 0,
        upcoming: 0,
      },
      pending: false,
    });

    expect(wrapper.text()).toContain('R$ 1000');
  });

  it('Should render billing details correctly', () => {
    const wrapper = factory({
      summary: {
        totalBills: 1000,
        paidBills: 400,
        dueSoon: 300,
        upcoming: 300,
      },
      pending: false,
    });

    expect(wrapper.text()).toContain('Contas pagas');
    expect(wrapper.text()).toContain('A vencer em 5 dias');
    expect(wrapper.text()).toContain('Próximos vencimentos');

    expect(wrapper.text()).toContain('R$ 400');
    expect(wrapper.text()).toContain('R$ 300');
  });

  it('Should use default values when summary is undefined', () => {
    const wrapper = factory({
      pending: false,
    });

    expect(wrapper.text()).toContain('R$ 0');
  });
});
