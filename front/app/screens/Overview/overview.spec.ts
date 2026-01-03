import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import Overview from './index.vue';

const { navigateToMock } = vi.hoisted(() => {
  return {
    navigateToMock: vi.fn(),
  };
});

mockNuxtImport('navigateTo', () => navigateToMock);

const clearTokenMock = vi.fn();

const globalMountOptions = {
  global: {
    stubs: {
      TitleSection: {
        template: '<h1>{{ title }}</h1>',
        props: ['title'],
      },
      Button: {
        template: '<button><slot />{{ label }}</button>',
        props: ['label'],
      },
      FinancialSummaryCard: {
        template: '<div data-test="financial-summary-card" />',
      },
      FinancialPots: {
        template: '<div data-test="financial-pots" />',
      },
      FinancialTransactions: {
        template: '<div data-test="financial-transactions" />',
      },
      FinancialBudgets: {
        template: '<div data-test="financial-budgets" />',
      },
      FinancialRecurringBills: {
        template: '<div data-test="financial-recurring-bills" />',
      },
      LogoutIcon: true,
    },
  },
};

vi.mock('~/composables', () => ({
  useAuth: () => ({
    clearToken: clearTokenMock,
  }),
}));

describe('Overview', () => {
  beforeEach(() => {
    clearTokenMock.mockClear();
    navigateToMock.mockClear();
  });

  it('Should render page title', () => {
    const wrapper = mount(Overview, globalMountOptions);
    expect(wrapper.text()).toContain('Visão Geral');
  });

  it('Should render logout button', () => {
    const wrapper = mount(Overview, globalMountOptions);
    expect(wrapper.text()).toContain('Sair');
  });

  it('Should call clearToken and navigate to login on logout click', async () => {
    const wrapper = mount(Overview, globalMountOptions);

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(clearTokenMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith('/login');
  });

  it('Should render FinancialSummaryCard', () => {
    const wrapper = mount(Overview, globalMountOptions);
    expect(wrapper.find('[data-test="financial-summary-card"]').exists()).toBe(true);
  });

  it('Should render FinancialPots', () => {
    const wrapper = mount(Overview, globalMountOptions);
    expect(wrapper.find('[data-test="financial-pots"]').exists()).toBe(true);
  });

  it('Should render FinancialTransactions', () => {
    const wrapper = mount(Overview, globalMountOptions);
    expect(wrapper.find('[data-test="financial-transactions"]').exists()).toBe(true);
  });

  it('Should render FinancialBudgets', () => {
    const wrapper = mount(Overview, globalMountOptions);
    expect(wrapper.find('[data-test="financial-budgets"]').exists()).toBe(true);
  });

  it('Should render FinancialRecurringBills', () => {
    const wrapper = mount(Overview, globalMountOptions);
    expect(wrapper.find('[data-test="financial-recurring-bills"]').exists()).toBe(true);
  });
});
