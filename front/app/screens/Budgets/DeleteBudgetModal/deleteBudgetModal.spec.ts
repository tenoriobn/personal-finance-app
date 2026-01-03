import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DeleteBudgetModal from './index.vue';
import type { BudgetData } from '../budgets.type';

const handleSubmitMock = vi.fn();

vi.mock('./useDeleteBudgetModal', () => ({
  useDeleteBudgetModal: (_budget: unknown, onSuccess: () => void) => ({
    isSubmitting: false,
    handleSubmit: () => {
      handleSubmitMock();
      onSuccess();
    },
  }),
}));

vi.mock('#components', () => ({
  Modal: {
    template: '<div><slot /></div>',
    props: ['modelValue', 'title', 'intro'],
  },
  Button: {
    template: '<button @click="$emit(\'click\')">Deletar</button>',
    emits: ['click'],
    props: ['label', 'isSubmitting'],
  },
}));

/* ------------------------------------------------------------------
 * HELPERS
 * ------------------------------------------------------------------ */

function createBudget(): BudgetData {
  return {
    id: 'budget-1',
    maximumSpend: 300,
    category: {
      id: 'cat-1',
      name: 'Supermercado',
      budgetId: 'budget-1',
    },
    theme: {
      id: 'theme-1',
      colorName: 'Red',
      colorHex: '#ff0000',
    },
    transactions: [],
  };
}

const mountComponent = () =>
  mount(DeleteBudgetModal, {
    props: {
      modelValue: true,
      budget: createBudget(),
    },
  });

/* ------------------------------------------------------------------
 * TESTS
 * ------------------------------------------------------------------ */

describe('DeleteBudgetModal (UI)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render modal title and intro', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toContain('Deletar Orçamento');
    expect(wrapper.text()).toContain(
      'Tem certeza que deseja deletar este orçamento?',
    );
  });

  it('Should call handleSubmit and emit events on delete', async () => {
    const wrapper = mountComponent();

    await wrapper.findComponent({ name: 'Button' }).trigger('click');

    expect(handleSubmitMock).toHaveBeenCalled();
    expect(wrapper.emitted('refreshBudgets')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });
});
