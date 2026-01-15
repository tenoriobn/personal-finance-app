import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import Budgets from './index.vue';
import type { BudgetData } from './budgets.type';

const budgetsMock = ref<BudgetData[]>([]);
const refreshBudgetsMock = vi.fn();

vi.mock('./useBudgets', () => ({
  useBudgets: () => ({
    budgets: budgetsMock,
    refreshBudgets: refreshBudgetsMock,
  }),
}));

const TitleSectionStub = {
  name: 'TitleSection',
  template: '<div data-testid="title-section" />',
  props: ['title'],
};

const ButtonStub = {
  name: 'Button',
  template: '<button data-testid="new-budget-btn" @click="$emit(\'click\')" />',
};

const SpendingChartStub = {
  name: 'SpendingChart',
  template: '<div data-testid="spending-chart" />',
};

const BudgetCardStub = {
  name: 'BudgetCard',
  template: `
    <div>
      <button data-testid="edit-budget" @click="$emit('edit-budget', 'budget-1')" />
      <button data-testid="delete-budget" @click="$emit('delete-budget', 'budget-1')" />
    </div>
  `,
};

const CreateBudgetModalStub = {
  name: 'CreateBudgetModal',
  template: '<div data-testid="create-budget-modal" />',
  props: ['modelValue'],
};

const EditBudgetModalStub = {
  name: 'EditBudgetModal',
  template: '<div data-testid="edit-budget-modal" />',
  props: ['modelValue', 'budget'],
};

const DeleteBudgetModalStub = {
  name: 'DeleteBudgetModal',
  template: '<div data-testid="delete-budget-modal" />',
  props: ['modelValue', 'budget'],
};

function makeBudget(overrides?: Partial<BudgetData>): BudgetData {
  return {
    id: 'budget-1',
    maximumSpend: 500,
    category: {
      id: 'cat-1',
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

function mountComponent() {
  return mount(Budgets, {
    global: {
      stubs: {
        TitleSection: TitleSectionStub,
        Button: ButtonStub,
        SpendingChart: SpendingChartStub,
        BudgetCard: BudgetCardStub,
        CreateBudgetModal: CreateBudgetModalStub,
        EditBudgetModal: EditBudgetModalStub,
        DeleteBudgetModal: DeleteBudgetModalStub,
      },
    },
  });
}

describe('Budgets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    budgetsMock.value = [makeBudget()];
  });

  it('Should render page title and create budget button', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-testid="title-section"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="new-budget-btn"]').exists()).toBe(true);
  });

  it('Should render SpendingChart component', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-testid="spending-chart"]').exists()).toBe(true);
  });

  it('Should open CreateBudgetModal when clicking new budget button', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-testid="new-budget-btn"]').trigger('click');

    const modal = wrapper.findComponent({ name: 'CreateBudgetModal' });
    expect(modal.props('modelValue')).toBe(true);
  });

  it('Should open EditBudgetModal with correct budget when edit event is emitted', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-testid="edit-budget"]').trigger('click');

    const modal = wrapper.findComponent({ name: 'EditBudgetModal' });

    expect(modal.props('modelValue')).toBe(true);
    expect(modal.props('budget')).toEqual(budgetsMock.value[0]);
  });

  it('Should open DeleteBudgetModal with correct budget when delete event is emitted', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-testid="delete-budget"]').trigger('click');

    const modal = wrapper.findComponent({ name: 'DeleteBudgetModal' });

    expect(modal.props('modelValue')).toBe(true);
    expect(modal.props('budget')).toEqual(budgetsMock.value[0]);
  });
});
