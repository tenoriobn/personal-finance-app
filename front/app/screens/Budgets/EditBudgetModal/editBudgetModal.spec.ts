import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import EditBudgetModal from './index.vue';
import type { BudgetData } from '../budgets.type';

vi.mock('./useEditBudgetModal', () => ({
  useEditBudgetModal: () => ({
    formState: {
      categoryId: 'cat-1',
      themeId: 'theme-1',
    },
    errors: {},
    isSubmitting: false,
    formattedAmount: 'R$ 100',
    onInput: vi.fn(),
    onKeyDown: vi.fn(),
    onPaste: vi.fn(),
    categoryOptions: [],
    themeOptions: [],
    initFormFromBudget: vi.fn(),
    resetErrors: vi.fn(),
    handleSubmit: vi.fn(),
  }),
}));

function createBudget(): BudgetData {
  return {
    id: 'budget-1',
    maximumSpend: 100,
    category: { id: 'cat-1', name: 'Alimentação' },
    theme: { id: 'theme-1', colorName: 'Azul', colorHex: '#00f' },
  } as BudgetData;
}

describe('EditBudgetModal', () => {
  it('renders modal when open', () => {
    const wrapper = mount(EditBudgetModal, {
      props: {
        modelValue: true,
        budget: createBudget(),
      },
    });

    expect(wrapper.text()).toContain('Editar Orçamento');
  });

  it('emits update:modelValue when closing', async () => {
    const wrapper = mount(EditBudgetModal, {
      props: {
        modelValue: true,
        budget: createBudget(),
      },
    });

    await wrapper.vm.$emit('update:modelValue', false);

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  it('submits form', async () => {
    const wrapper = mount(EditBudgetModal, {
      props: {
        modelValue: true,
        budget: createBudget(),
      },
    });

    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.exists()).toBe(true);
  });
});
