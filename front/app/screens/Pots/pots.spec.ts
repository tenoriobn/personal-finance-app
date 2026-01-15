import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import Pots from './index.vue';
import type { PotData } from './pots.type';

const potsMock = ref<PotData[]>([
  {
    id: 'pot-1',
    name: 'Poupança Teste 1',
    targetAmount: 500,
    totalAmount: 200,
    theme: { id: 'theme-1', colorName: 'Azul', colorHex: '#0000ff' },
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'pot-2',
    name: 'Poupança Teste 2',
    targetAmount: 1000,
    totalAmount: 600,
    theme: { id: 'theme-2', colorName: 'Verde', colorHex: '#00ff00' },
    createdAt: '2024-01-02T00:00:00.000Z',
  },
]);

vi.mock('./usePots', () => ({
  usePots: vi.fn(() => ({
    pots: potsMock,
  })),
}));

const mountComponent = () =>
  mount(Pots, {
    global: {
      stubs: {
        Button: { name: 'Button', template: '<button @click="$emit(\'click\')"><slot /></button>', props: ['label'] },
        TitleSection: { name: 'TitleSection', template: '<div><slot /></div>', props: ['title'] },
        PotCard: { name: 'PotCard', template: '<div />', emits: ['edit-pot', 'delete-pot', 'add-money', 'withdraw-money'] },
        CreatePotModal: { name: 'CreatePotModal', template: '<div />', props: ['modelValue'], emits: ['update:modelValue'] },
        EditPotModal: { name: 'EditPotModal', template: '<div />', props: ['modelValue', 'pot'], emits: ['update:modelValue'] },
        DeletePotModal: { name: 'DeletePotModal', template: '<div />', props: ['modelValue', 'pot'], emits: ['update:modelValue'] },
        PotAddMoneyModal: { name: 'PotAddMoneyModal', template: '<div />', props: ['modelValue', 'pot'], emits: ['update:modelValue'] },
        PotWithdrawMoneyModal: { name: 'PotWithdrawMoneyModal', template: '<div />', props: ['modelValue', 'pot'], emits: ['update:modelValue'] },
      },
    },
  });

describe('Pots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('Should render title and new pot button', () => {
      const wrapper = mountComponent();

      const title = wrapper.findComponent({ name: 'TitleSection' });
      const button = wrapper.findComponent({ name: 'Button' });

      expect(title.exists()).toBe(true);
      expect(title.props('title')).toBe('Poupanças');

      expect(button.exists()).toBe(true);
      expect(button.props('label')).toBe('+Nova Poupança');
    });

    it('Should render PotCard and all modals', () => {
      const wrapper = mountComponent();

      expect(wrapper.findComponent({ name: 'PotCard' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'CreatePotModal' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'EditPotModal' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'DeletePotModal' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'PotAddMoneyModal' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'PotWithdrawMoneyModal' }).exists()).toBe(true);
    });
  });

  describe('Button behavior', () => {
    it('Should open CreatePotModal when new pot button is clicked', async () => {
      const wrapper = mountComponent();

      const button = wrapper.findComponent({ name: 'Button' });
      await button.trigger('click');

      const createModal = wrapper.findComponent({ name: 'CreatePotModal' });
      expect(createModal.props('modelValue')).toBe(true);
    });
  });

  describe('PotCard events', () => {
    it('Should open EditPotModal with correct pot when edit-pot is emitted', async () => {
      const wrapper = mountComponent();

      const potCard = wrapper.findComponent({ name: 'PotCard' });
      await potCard.vm.$emit('edit-pot', 'pot-2');

      const editModal = wrapper.findComponent({ name: 'EditPotModal' });
      expect(editModal.props('modelValue')).toBe(true);
      expect(editModal.props('pot')?.id).toBe('pot-2');
    });

    it('Should open DeletePotModal with correct pot when delete-pot is emitted', async () => {
      const wrapper = mountComponent();

      const potCard = wrapper.findComponent({ name: 'PotCard' });
      await potCard.vm.$emit('delete-pot', 'pot-1');

      const deleteModal = wrapper.findComponent({ name: 'DeletePotModal' });
      expect(deleteModal.props('modelValue')).toBe(true);
      expect(deleteModal.props('pot')?.id).toBe('pot-1');
    });

    it('Should open PotAddMoneyModal with correct pot when add-money is emitted', async () => {
      const wrapper = mountComponent();

      const potCard = wrapper.findComponent({ name: 'PotCard' });
      await potCard.vm.$emit('add-money', 'pot-1');

      const addModal = wrapper.findComponent({ name: 'PotAddMoneyModal' });
      expect(addModal.props('modelValue')).toBe(true);
      expect(addModal.props('pot')?.id).toBe('pot-1');
    });

    it('Should open PotWithdrawMoneyModal with correct pot when withdraw-money is emitted', async () => {
      const wrapper = mountComponent();

      const potCard = wrapper.findComponent({ name: 'PotCard' });
      await potCard.vm.$emit('withdraw-money', 'pot-2');

      const withdrawModal = wrapper.findComponent({ name: 'PotWithdrawMoneyModal' });
      expect(withdrawModal.props('modelValue')).toBe(true);
      expect(withdrawModal.props('pot')?.id).toBe('pot-2');
    });
  });
});
