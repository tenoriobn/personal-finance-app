import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Transactions from './index.vue';
import { ref, computed } from 'vue';
import type { useTransactions } from './useTransactions';
import type { TransactionsData } from './transactions.type';

vi.mock('./useTransactions', () => ({
  useTransactions: vi.fn(),
}));

vi.mock('#components', () => ({
  TitleSection: {
    name: 'TitleSection',
    props: ['title'],
    template: '<div data-testid="title">{{ title }}</div>',
  },
  Button: {
    name: 'Button',
    props: ['label'],
    emits: ['click'],
    template:
      '<button @click="$emit(\'click\')">{{ label }}</button>',
  },
}));

vi.mock('./Table/index.vue', () => ({
  default: {
    name: 'Table',
    props: ['transactions', 'pending'],
    template: '<div data-testid="table" />',
  },
}));

vi.mock('./Filters/index.vue', () => ({
  default: {
    name: 'Filter',
    template: '<div data-testid="filter" />',
  },
}));

vi.mock('~/components/Pagination/index.vue', () => ({
  default: {
    name: 'Pagination',
    props: ['currentPage', 'totalPages'],
    emits: ['page-change'],
    template: '<div data-testid="pagination" />',
  },
}));

vi.mock('./CreateTransactionModal/index.vue', () => ({
  default: {
    name: 'CreateTransactionModal',
    props: ['modelValue'],
    emits: ['update:modelValue', 'transaction-created'],
    template: '<div data-testid="create-transaction-modal" />',
  },
}));

const useTransactionsMock = vi.mocked(await import('./useTransactions')).useTransactions;

type UseTransactionsReturn = ReturnType<typeof useTransactions>;

const createUseTransactionsState = (
  overrides?: Partial<UseTransactionsReturn>,
): UseTransactionsReturn => {
  const search = ref('');
  const selectedCategory = ref('');
  const selectedSort = ref('');
  const currentPage = ref(1);

  const totalPagesRef = ref(1);
  const transactionsRef = ref<TransactionsData[]>([]);

  const refreshTransactions = vi.fn(async () => {});

  return {
    search,
    selectedCategory,
    selectedSort,
    currentPage,
    totalPages: computed(() => totalPagesRef.value),
    transactions: computed(() => transactionsRef.value),
    goToPage: vi.fn(),
    pending: ref(false),
    refreshTransactions,
    ...overrides,
  };
};

const mountComponent = () => mount(Transactions);

describe('Transactions Page', () => {
  beforeEach(() => {
    useTransactionsMock.mockReturnValue(createUseTransactionsState());
  });

  describe('Renderização', () => {
    it('Should render page title', () => {
      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Transações');
    });

    it('Should render main child components', () => {
      const wrapper = mountComponent();

      expect(wrapper.find('[data-testid="filter"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="table"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="create-transaction-modal"]').exists()).toBe(true);
    });
  });

  describe('Comportamento', () => {
    it('Should open create transaction modal when clicking new transaction button', async () => {
      const wrapper = mountComponent();

      const button = wrapper.find('button');
      await button.trigger('click');

      const modal = wrapper.getComponent({ name: 'CreateTransactionModal' });
      expect(modal.props('modelValue')).toBe(true);
    });

    it('Should render pagination only when totalPages is greater than 1', () => {
      useTransactionsMock.mockReturnValue(
        createUseTransactionsState({
          totalPages: computed(() => 3),
        }),
      );

      const wrapper = mountComponent();

      expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true);
    });

    it('Should not render pagination when totalPages is 1', () => {
      const wrapper = mountComponent();

      expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(false);
    });
  });
});
