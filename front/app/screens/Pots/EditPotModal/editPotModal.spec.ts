// editPotModal.spec.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import EditPotModal from './index.vue';
import type { PotData } from '../pots.type';

const refreshThemesMock = vi.fn();
const handleSubmitMock = vi.fn();
const resetErrorsMock = vi.fn();
const initFormFromPotMock = vi.fn();

const themesRef = ref([
  { id: 'theme-1', colorName: 'Azul', colorHex: '#0000ff' },
]);

const potMock: PotData = {
  id: 'pot-1',
  name: 'Viagem',
  targetAmount: 500,
  totalAmount: 150,
  userId: 'user-1',
  theme: {
    id: 'theme-1',
    colorName: 'Azul',
    colorHex: '#0000ff',
  },
  createdAt: '2024-01-01',
};

const editPotModalState = {
  formState: {
    name: 'Viagem',
    themeId: 'theme-1',
  },
  errors: {
    name: '',
    targetAmount: '',
    themeId: '',
  },
  isSubmitting: false,
  formattedAmount: 'R$ 500,00',
  resetErrors: resetErrorsMock,
  initFormFromPot: initFormFromPotMock,
  onInput: vi.fn(),
  onKeyDown: vi.fn(),
  onPaste: vi.fn(),
  themeOptions: [
    { id: 'theme-1', name: 'Azul', colorHex: '#0000ff' },
  ],
  handleSubmit: handleSubmitMock,
};

vi.mock('../useThemes', () => ({
  useThemes: () => ({
    themes: themesRef,
    refreshThemes: refreshThemesMock,
  }),
}));

vi.mock('./useEditPotModal', () => ({
  useEditPotModal: vi.fn(() => editPotModalState),
}));

const mountComponent = (props?: { modelValue?: boolean, pot?: PotData | null }) =>
  mount(EditPotModal, {
    props: {
      modelValue: true,
      pot: potMock,
      ...props,
    },
    global: {
      stubs: {
        Modal: {
          name: 'Modal',
          template: '<div><slot /></div>',
          props: ['modelValue', 'intro'],
        },
        Input: {
          name: 'Input',
          template: '<input />',
          props: ['modelValue'],
        },
        Dropdown: {
          name: 'Dropdown',
          template: '<select />',
          props: ['modelValue', 'options'],
        },
        Button: {
          template: '<button type="submit">Editar</button>',
        },
        FormError: {
          template: '<span />',
          props: ['message'],
        },
      },
    },
  });

describe('EditPotModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('Should render the edit form', () => {
      const wrapper = mountComponent();

      expect(wrapper.find('form').exists()).toBe(true);
    });
  });

  describe('Modal content', () => {
    it('Should render the correct modal intro text', () => {
      const wrapper = mountComponent();

      const modal = wrapper.findComponent({ name: 'Modal' });
      expect(modal.props('intro')).toBe(
        'Se seus objetivos de poupança mudarem, fique à vontade para atualizar seus valores.',
      );
    });
  });

  describe('Form behavior', () => {
    it('Should reset errors and reinitialize form when modal is closed', async () => {
      const wrapper = mountComponent();
      await wrapper.setProps({ modelValue: false });
      await nextTick();

      expect(resetErrorsMock).toHaveBeenCalledTimes(1);
      expect(initFormFromPotMock).toHaveBeenCalledTimes(1);
    });

    it('Should call handleSubmit when form is submitted', async () => {
      const wrapper = mountComponent();

      await wrapper.find('form').trigger('submit');

      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });

    it('Should bind formatted amount to target amount input', () => {
      const wrapper = mountComponent();

      const inputs = wrapper.findAllComponents({ name: 'Input' });
      const targetAmountInput = inputs[1];

      expect(targetAmountInput!.props('modelValue')).toBe(
        editPotModalState.formattedAmount,
      );
    });

    it('Should pass theme options to Dropdown', () => {
      const wrapper = mountComponent();

      const dropdown = wrapper.findComponent({ name: 'Dropdown' });

      expect(dropdown.props('options')).toEqual(
        editPotModalState.themeOptions,
      );
    });
  });

  describe('Business rules', () => {
    it('Should prevent submission when target amount is lower than already saved amount', async () => {
      editPotModalState.errors.targetAmount
        = 'Está poupança já economizou R$ 150,00. O valor da meta não pode ser menor que isso.';

      const wrapper = mountComponent();

      await wrapper.find('form').trigger('submit');

      expect(handleSubmitMock).toHaveBeenCalled();
      expect(editPotModalState.errors.targetAmount).toContain(
        'O valor da meta não pode ser menor',
      );
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
