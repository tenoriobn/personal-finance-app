import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import BudgetCard from './index.vue';
import type { BudgetData } from '../budgets.type';

vi.mock('~/utils', () => ({
  formatCurrency: vi.fn((value: number) => `formatted-${value}`),
}));

vi.mock('~/utils/calculations', () => ({
  calculateSpent: vi.fn(() => 300),
  calculateRemaining: vi.fn(() => 300),
  calculatePercentUsed: vi.fn(() => 50),
}));

const budgetsMock = ref<BudgetData[]>([]);
const pendingMock = ref(false);

vi.mock('../useBudgets', () => ({
  useBudgets: () => ({
    budgets: budgetsMock,
    pending: pendingMock,
  }),
}));

vi.mock('#components', () => ({
  Progressbar: {
    template: '<div role="progressbar" />',
    props: ['colorHex', 'percent'],
  },
  CardActionsMenu: {
    template: `
      <div>
        <button
          data-testid="actions-toggle"
          @click="$emit('update:open', true)"
        />
        <button
          data-testid="edit-action"
          @click="$emit('edit')"
        />
        <button
          data-testid="delete-action"
          @click="$emit('delete')"
        />
      </div>
    `,
    props: ['open', 'deleteLabel', 'editLabel'],
  },
}));

vi.mock('./BalanceOverview/index.vue', () => ({
  default: {
    template: '<div data-test="balance-overview" />',
    props: ['colorHex', 'spent', 'free'],
  },
}));

vi.mock('./LatestSpendingTable/index.vue', () => ({
  default: {
    template: '<div data-test="latest-spending-table" />',
    props: ['transactions', 'categoryId'],
  },
}));

vi.mock('./BudgetCardSkeleton.vue', () => ({
  default: {
    template: '<div data-test="skeleton" />',
  },
}));

const mountComponent = () =>
  mount(BudgetCard, {
    global: {
      stubs: {
        NuxtLink: true,
      },
    },
  });

const budgetMock: BudgetData = {
  id: 'budget-1',
  maximumSpend: 600,
  category: {
    id: 'supermercado',
    name: 'Supermercado',
    budgetId: 'budget-1',
  },
  theme: {
    id: 'theme-1',
    colorName: 'Red',
    colorHex: '#ff0000',
  },
  transactions: [
    {
      id: 't1',
      name: 'Compra',
      amount: -100,
      budgetId: 'budget-1',
      date: '2025-01-01',
      recurring: false,
    },
    {
      id: 't2',
      name: 'Compra 2',
      amount: -50,
      budgetId: 'budget-1',
      date: '2025-01-02',
      recurring: false,
    },
    {
      id: 't3',
      name: 'Compra 3',
      amount: -30,
      budgetId: 'budget-1',
      date: '2025-01-03',
      recurring: false,
    },
    {
      id: 't4',
      name: 'Compra 4',
      amount: -20,
      budgetId: 'budget-1',
      date: '2025-01-04',
      recurring: false,
    },
  ],
};

describe('BudgetCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    budgetsMock.value = [];
    pendingMock.value = false;
  });

  describe('Render states', () => {
    it('Should render skeleton when pending is true', () => {
      pendingMock.value = true;

      const wrapper = mountComponent();

      expect(wrapper.find('[data-test="skeleton"]').exists()).toBe(true);
    });

    it('Should render empty state when there are no budgets', () => {
      budgetsMock.value = [];

      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Nenhum orçamento encontrado');
    });
  });

  describe('Budgets rendering', () => {
    beforeEach(() => {
      budgetsMock.value = [budgetMock];
    });

    it('Should render budget category name and theme color', () => {
      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Supermercado');
      expect(wrapper.html()).toContain('background-color: #ff0000');
    });

    it('Should render formatted maximum spend value', () => {
      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Máximo de formatted-600');
    });

    it('Should render Progressbar component', () => {
      const wrapper = mountComponent();

      expect(wrapper.find('[role="progressbar"]').exists()).toBe(true);
    });

    it('Should render BalanceOverview component', () => {
      const wrapper = mountComponent();

      expect(wrapper.find('[data-test="balance-overview"]').exists()).toBe(true);
    });

    it('Should render LatestSpendingTable component', () => {
      const wrapper = mountComponent();

      expect(wrapper.find('[data-test="latest-spending-table"]').exists()).toBe(true);
    });
  });

  describe('Actions behavior', () => {
    beforeEach(() => {
      budgetsMock.value = [budgetMock];
    });

    it('Should emit "edit-budget" when edit action is triggered', async () => {
      const wrapper = mountComponent();

      await wrapper.find('[data-testid="actions-toggle"]').trigger('click');
      await wrapper.find('[data-testid="edit-action"]').trigger('click');

      expect(wrapper.emitted('edit-budget')).toEqual([['budget-1']]);
    });

    it('Should emit "delete-budget" when delete action is triggered', async () => {
      const wrapper = mountComponent();

      await wrapper.find('[data-testid="actions-toggle"]').trigger('click');
      await wrapper.find('[data-testid="delete-action"]').trigger('click');

      expect(wrapper.emitted('delete-budget')).toEqual([['budget-1']]);
    });
  });
});
