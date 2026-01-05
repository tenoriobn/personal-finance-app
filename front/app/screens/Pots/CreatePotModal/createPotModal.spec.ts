import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import CreatePotModal from './index.vue';

const refreshThemesMock = vi.fn();
const handleSubmitMock = vi.fn();

const themesRef = ref([
  { id: '1', colorName: 'Azul', colorHex: '#0000ff' },
]);

const createPotModalState = {
  formState: {
    name: '',
    themeId: '',
  },
  errors: {
    name: '',
    targetAmount: '',
    themeId: '',
  },
  isSubmitting: false,
  formattedAmount: 'R$ 0,00',
  onInput: vi.fn(),
  onKeyDown: vi.fn(),
  onPaste: vi.fn(),
  hasAvailableThemes: true,
  modalIntro: 'Intro padrão',
  handleSubmit: handleSubmitMock,
};

vi.mock('../useThemes', () => ({
  useThemes: () => ({
    themes: themesRef,
    refreshThemes: refreshThemesMock,
  }),
}));

vi.mock('./useCreatePotModal', () => ({
  useCreatePotModal: vi.fn(() => createPotModalState),
}));

const mountComponent = (props?: { modelValue?: boolean }) =>
  mount(CreatePotModal, {
    props: {
      modelValue: true,
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
          template: '<button type="submit">Criar</button>',
        },
        FormError: {
          template: '<span />',
          props: ['message'],
        },
      },
    },
  });

describe('CreatePotModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createPotModalState.hasAvailableThemes = true;
    themesRef.value = [
      { id: '1', colorName: 'Azul', colorHex: '#0000ff' },
    ];
  });

  describe('Rendering', () => {
    it('Should render the form when there are available themes', () => {
      const wrapper = mountComponent();

      expect(wrapper.find('form').exists()).toBe(true);
    });

    it('Should not render the form when there are no available themes', () => {
      createPotModalState.hasAvailableThemes = false;
      themesRef.value = [];

      const wrapper = mountComponent();

      expect(wrapper.find('form').exists()).toBe(false);
    });
  });

  describe('Modal content', () => {
    it('Should pass the correct intro text to Modal', () => {
      const wrapper = mountComponent();

      const modal = wrapper.findComponent({ name: 'Modal' });
      expect(modal.props('intro')).toBe(createPotModalState.modalIntro);
    });
  });

  describe('Form behavior', () => {
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
        createPotModalState.formattedAmount,
      );
    });

    it('Should pass mapped theme options to Dropdown', () => {
      const wrapper = mountComponent();

      const dropdown = wrapper.findComponent({ name: 'Dropdown' });

      expect(dropdown.props('options')).toEqual([
        { id: '1', name: 'Azul', colorHex: '#0000ff' },
      ]);
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
