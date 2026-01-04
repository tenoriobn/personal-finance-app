import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateTransactionModal from './index.vue';

vi.mock('~/composables', () => ({
  useApiGet: vi.fn(() => ({
    data: { value: [] },
  })),
}));

const handleSubmitMock = vi.fn();

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
    errors: {},
    isSubmitting: false,
    formattedAmount: '0',
    onInput: vi.fn(),
    onKeyDown: vi.fn(),
    onPaste: vi.fn(),
    hasAvailableCategories: true,
    modalIntro: 'Intro mock',
    categoryOptions: [],
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
          template: '<div><slot /></div>',
          emits: ['update:modelValue'],
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

  it('renders modal when modelValue is true', () => {
    const wrapper = mountComponent();

    expect(wrapper.exists()).toBe(true);
  });

  it('emits update:modelValue when modal emits close', async () => {
    const wrapper = mountComponent();

    const modal = wrapper.findComponent({ name: 'Modal' });
    expect(modal.exists()).toBe(true);

    await modal.vm.$emit('update:modelValue', false);

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('renders form when hasAvailableCategories is true', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('calls handleSubmit on form submit', async () => {
    const wrapper = mountComponent();

    await wrapper.find('form').trigger('submit.prevent');

    expect(handleSubmitMock).toHaveBeenCalled();
  });
});
