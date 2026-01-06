import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, type Ref } from 'vue';
import DeletePotModal from './index.vue';
import type { PotData } from '../pots.type';

const handleSubmitMock = vi.fn();
const isSubmittingMock = ref(false);
let onSuccessCallback: (() => void) | null = null;

vi.mock('./useDeletePotModal', () => ({
  useDeletePotModal: (
    _pot: Ref<PotData | null>,
    onSuccess: () => void,
  ) => {
    onSuccessCallback = onSuccess;

    return {
      isSubmitting: isSubmittingMock,
      handleSubmit: handleSubmitMock,
    };
  },
}));

const potMock: PotData = {
  id: 'pot-1',
  name: 'Poupança Teste',
  targetAmount: 1000,
  totalAmount: 0,
  theme: {
    id: 'theme-1',
    colorName: 'Azul',
    colorHex: '#0000ff',
  },
  createdAt: '2024-01-01T00:00:00.000Z',
};

const mountComponent = (props = {}) =>
  mount(DeletePotModal, {
    props: {
      modelValue: true,
      pot: potMock,
      ...props,
    },
    global: {
      stubs: {
        Modal: {
          name: 'Modal',
          props: ['modelValue', 'title', 'intro'],
          template: '<div><slot /></div>',
        },
        Button: {
          name: 'Button',
          props: ['label', 'isSubmitting'],
          emits: ['click'],
          template: `
            <button @click="$emit('click')">
              {{ label }}
            </button>
          `,
        },
      },
    },
  });

describe('DeletePotModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isSubmittingMock.value = false;
    onSuccessCallback = null;
  });

  describe('Rendering', () => {
    it('Should pass correct title and intro to Modal', () => {
      const wrapper = mountComponent();
      const modal = wrapper.findComponent({ name: 'Modal' });

      expect(modal.props('title')).toBe('Deletar Poupança');
      expect(modal.props('intro')).toBe(
        'Tem certeza de que deseja excluir esta poupança? Esta ação é irreversível e todas as informações associadas a ela serão perdidas.',
      );
    });

    it('Should render delete button', () => {
      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Deletar Poupança');
    });
  });

  describe('Form behavior', () => {
    it('Should call handleSubmit when delete button is clicked', async () => {
      const wrapper = mountComponent();
      const button = wrapper.find('button');

      await button.trigger('click');

      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });

    it('Should pass isSubmitting to Button', () => {
      isSubmittingMock.value = true;
      const wrapper = mountComponent();
      const button = wrapper.findComponent({ name: 'Button' });

      expect(button.props('isSubmitting')).toBe(true);
    });
  });

  describe('Emits', () => {
    it('Should emit refreshPots and close modal on success', async () => {
      const wrapper = mountComponent();

      expect(onSuccessCallback).not.toBeNull();

      onSuccessCallback?.();

      expect(wrapper.emitted('refreshPots')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    });
  });
});
