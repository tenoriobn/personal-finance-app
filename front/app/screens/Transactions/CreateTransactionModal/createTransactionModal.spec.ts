import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateTransactionModal from './index.vue';

const handleSubmitMock = vi.fn();

vi.mock('~/composables', () => ({
  useApiGet: vi.fn(() => ({
    data: { value: [{ id: '1', name: 'Alimentação', budgetId: 'b1' }] },
  })),
}));

vi.mock('./useCreateTransactionModal', () => ({
  useCreateTransactionModal: vi.fn(() => ({
    formState: {
      name: '',
      date: '',
      amount: 0,
      recurring: false,
      budgetId: '',
      type: 'IN',
    },
    errors: {
      name: '',
      date: '',
      amount: '',
      budgetId: '',
    },
    isSubmitting: false,
    formattedAmount: '0',
    onInput: vi.fn(),
    onKeyDown: vi.fn(),
    onPaste: vi.fn(),
    hasAvailableCategories: true,
    modalIntro: 'Intro mock',
    categoryOptions: [{ id: 'b1', name: 'Alimentação' }],
    handleSubmit: handleSubmitMock,
  })),
}));

const mountComponent = (props = {}) =>
  mount(CreateTransactionModal, {
    props: {
      modelValue: true,
      ...props,
    },
    global: {
      stubs: {
        Modal: {
          name: 'Modal',
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template: '<div><slot /></div>',
        },
        Input: true,
        InputDatePicker: true,
        Dropdown: true,
        FormError: true,
        InputCheckbox: true,
        Button: {
          template: '<button type="submit">Criar</button>',
        },
      },
    },
  });

describe('CreateTransactionModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Render', () => {
    it('Should render modal when modelValue is true', () => {
      const wrapper = mountComponent();
      expect(wrapper.exists()).toBe(true);
    });

    it('Should render form when there are available categories', () => {
      const wrapper = mountComponent();
      expect(wrapper.find('form').exists()).toBe(true);
    });
  });

  describe('Modal behavior', () => {
    it('Should emit update:modelValue when modal requests close', async () => {
      const wrapper = mountComponent();
      const modal = wrapper.findComponent({ name: 'Modal' });

      await modal.vm.$emit('update:modelValue', false);

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    });
  });

  describe('Submit behavior', () => {
    it('Should call handleSubmit when form is submitted', async () => {
      const wrapper = mountComponent();

      await wrapper.find('form').trigger('submit.prevent');

      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });
  });
});
