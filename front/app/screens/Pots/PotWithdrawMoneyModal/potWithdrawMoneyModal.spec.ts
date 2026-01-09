import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import PotWithdrawMoneyModal from './index.vue';
import type { PotData } from '../pots.type';

const handleSubmitMock = vi.fn();
const resetMock = vi.fn();

const potMock = ref<PotData | null>({
  id: 'pot-1',
  name: 'Poupança Teste',
  targetAmount: 250,
  totalAmount: 200,
  theme: {
    id: 'theme-1',
    colorName: 'Azul',
    colorHex: '#0000ff',
  },
  createdAt: '2024-01-01T00:00:00.000Z',
});

const composableState = {
  formattedAmount: 'R$ 0,00',
  onInput: vi.fn(),
  onKeyDown: vi.fn(),
  onPaste: vi.fn(),
  errors: {
    withdrawAmount: '',
  },
  isSubmitting: false,
  currentTotal: 200,
  currentPercent: 80,
  reset: resetMock,
  handleSubmit: handleSubmitMock,
};

vi.mock('./usePotWithdrawMoneyModal', () => ({
  usePotWithdrawMoneyModal: vi.fn(() => composableState),
}));

const mountComponent = (props?: { modelValue?: boolean }) =>
  mount(PotWithdrawMoneyModal, {
    props: {
      modelValue: true,
      pot: potMock.value,
      ...props,
    },
    global: {
      stubs: {
        Modal: {
          name: 'Modal',
          template: '<div><slot /></div>',
          props: ['modelValue', 'title', 'intro'],
        },
        Input: {
          name: 'Input',
          template: '<input />',
          props: ['modelValue'],
        },
        Button: {
          name: 'Button',
          template: '<button />',
          props: ['isSubmitting'],
        },
        Progressbar: {
          name: 'Progressbar',
          template: '<div />',
          props: ['percent', 'colorHex'],
        },
        FormError: {
          name: 'FormError',
          template: '<span />',
          props: ['message'],
        },
      },
    },
  });
describe('PotWithdrawMoneyModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('Should render modal with dynamic title and intro', () => {
      const wrapper = mountComponent();

      const modal = wrapper.findComponent({ name: 'Modal' });

      expect(modal.props('title')).toBe('Retirar de Poupança Teste');

      expect(modal.props('intro')).toBe(
        'Retire dinheiro desta poupança. O valor será devolvido ao saldo principal e reduzirá o valor que você tem nesta poupança.',
      );
    });

    it('Should render withdraw money form', () => {
      const wrapper = mountComponent();

      expect(wrapper.find('form').exists()).toBe(true);
    });
  });

  describe('Form behavior', () => {
    it('Should call handleSubmit when form is submitted', async () => {
      const wrapper = mountComponent();

      await wrapper.find('form').trigger('submit');

      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });

    it('Should bind formatted amount to input', () => {
      const wrapper = mountComponent();

      const input = wrapper.findComponent({ name: 'Input' });
      expect(input.props('modelValue')).toBe(composableState.formattedAmount);
    });

    it('Should pass percent and color to Progressbar', () => {
      const wrapper = mountComponent();

      const progress = wrapper.findComponent({ name: 'Progressbar' });

      expect(progress.props('percent')).toBe(composableState.currentPercent);
      expect(progress.props('colorHex')).toBe(potMock.value!.theme.colorHex);
    });
  });

  describe('Watch behavior', () => {
    it('Should reset state when modal is opened', async () => {
      const wrapper = mountComponent({ modelValue: false });

      await wrapper.setProps({ modelValue: true });

      expect(resetMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Emits', () => {
    it('Should emit update:modelValue when modal visibility changes', async () => {
      const wrapper = mountComponent();

      const modal = wrapper.findComponent({ name: 'Modal' });
      await modal.vm.$emit('update:modelValue', false);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
    });
  });
});
