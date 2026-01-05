import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PotCard from './index.vue';

const mockPots = vi.fn();
const mockPending = vi.fn();

vi.mock('../usePots', () => ({
  usePots: () => ({
    pots: mockPots(),
    pending: mockPending(),
  }),
}));

vi.mock('~/utils', () => ({
  formatCurrency: vi.fn((value: number) => `R$ ${value}`),
}));

vi.mock('~/utils/calculations', () => ({
  calculatePercentUsed: vi.fn((total: number, target: number) =>
    target === 0 ? 0 : Math.min((total / target) * 100, 100),
  ),
}));

const mountComponent = (): VueWrapper =>
  mount(PotCard, {
    global: {
      stubs: {
        Button: {
          props: ['label', 'disabled', 'title'],
          emits: ['click'],
          template: `
            <button :disabled="disabled" @click="$emit('click')">
              {{ label }}
            </button>
            
          `,
        },
        Progressbar: {
          props: ['percent', 'colorHex'],
          template: '<div data-testid="progressbar" />',
        },
        CardActionsMenu: {
          emits: ['edit', 'delete', 'update:open'],
          template: `
            <div>
              <button data-testid="edit" @click="$emit('edit')" />
              <button data-testid="delete" @click="$emit('delete')" />
            </div>
          `,
        },
        PotCardSkeleton: {
          template: '<div data-testid="skeleton" />',
        },
      },
    },
  });

describe('PotCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('Should render skeleton when pending is true', () => {
      mockPending.mockReturnValue(true);
      mockPots.mockReturnValue([]);

      const wrapper = mountComponent();

      expect(wrapper.find('[data-testid="skeleton"]').exists()).toBe(true);
    });

    it('Should render empty state message when there are no pots', () => {
      mockPending.mockReturnValue(false);
      mockPots.mockReturnValue([]);

      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Nenhuma poupança encontrada');
    });

    it('Should render pot card data when pots are available', () => {
      mockPending.mockReturnValue(false);
      mockPots.mockReturnValue([
        {
          id: '1',
          name: 'Viagem',
          totalAmount: 100,
          targetAmount: 200,
          theme: { colorHex: '#000' },
        },
      ]);

      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Viagem');
      expect(wrapper.text()).toContain('Total Economizado');
      expect(wrapper.text()).toContain('R$ 100');
      expect(wrapper.text()).toContain('Meta de R$ 200');
      expect(wrapper.find('[data-testid="progressbar"]').exists()).toBe(true);
    });
  });

  describe('Estados e regras de negócio', () => {
    it('Should disable add money button when totalAmount is greater or equal to targetAmount', () => {
      mockPending.mockReturnValue(false);
      mockPots.mockReturnValue([
        {
          id: '1',
          name: 'Reserva',
          totalAmount: 200,
          targetAmount: 200,
          theme: { colorHex: '#000' },
        },
      ]);

      const wrapper = mountComponent();
      const addButton = wrapper.findAll('button').find(b => b.text() === '+Add Dinheiro');

      expect(addButton?.attributes('disabled')).toBeDefined();
    });

    it('Should disable withdraw button when totalAmount is zero', () => {
      mockPending.mockReturnValue(false);
      mockPots.mockReturnValue([
        {
          id: '1',
          name: 'Reserva',
          totalAmount: 0,
          targetAmount: 200,
          theme: { colorHex: '#000' },
        },
      ]);

      const wrapper = mountComponent();
      const withdrawButton = wrapper.findAll('button').find(b => b.text() === 'Retirar');

      expect(withdrawButton?.attributes('disabled')).toBeDefined();
    });

    it('Should render percent value with two decimal places', () => {
      mockPending.mockReturnValue(false);
      mockPots.mockReturnValue([
        {
          id: '1',
          name: 'Reserva',
          totalAmount: 55,
          targetAmount: 100,
          theme: { colorHex: '#000' },
        },
      ]);

      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('55.00%');
    });
  });

  describe('Eventos', () => {
    it('Should emit edit-pot event when edit action is triggered', async () => {
      mockPending.mockReturnValue(false);
      mockPots.mockReturnValue([
        {
          id: '1',
          name: 'Reserva',
          totalAmount: 50,
          targetAmount: 100,
          theme: { colorHex: '#000' },
        },
      ]);

      const wrapper = mountComponent();

      await wrapper.find('[data-testid="edit"]').trigger('click');

      expect(wrapper.emitted('edit-pot')).toEqual([['1']]);
    });

    it('Should emit delete-pot event when delete action is triggered', async () => {
      mockPending.mockReturnValue(false);
      mockPots.mockReturnValue([
        {
          id: '1',
          name: 'Reserva',
          totalAmount: 50,
          targetAmount: 100,
          theme: { colorHex: '#000' },
        },
      ]);

      const wrapper = mountComponent();

      await wrapper.find('[data-testid="delete"]').trigger('click');

      expect(wrapper.emitted('delete-pot')).toEqual([['1']]);
    });

    it('Should emit add-money event when add money button is clicked', async () => {
      mockPending.mockReturnValue(false);
      mockPots.mockReturnValue([
        {
          id: '1',
          name: 'Reserva',
          totalAmount: 50,
          targetAmount: 100,
          theme: { colorHex: '#000' },
        },
      ]);

      const wrapper = mountComponent();
      const addButton = wrapper.findAll('button').find(b => b.text() === '+Add Dinheiro')!;

      await addButton.trigger('click');

      expect(wrapper.emitted('add-money')).toEqual([['1']]);
    });

    it('Should emit withdraw-money event when withdraw button is clicked', async () => {
      mockPending.mockReturnValue(false);
      mockPots.mockReturnValue([
        {
          id: '1',
          name: 'Reserva',
          totalAmount: 50,
          targetAmount: 100,
          theme: { colorHex: '#000' },
        },
      ]);

      const wrapper = mountComponent();
      const withdrawButton = wrapper.findAll('button').find(b => b.text() === 'Retirar')!;

      await withdrawButton.trigger('click');

      expect(wrapper.emitted('withdraw-money')).toEqual([['1']]);
    });
  });
});
