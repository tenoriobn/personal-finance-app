import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import RecurringBills from './index.vue';

const goToPageMock = vi.fn();

vi.mock('./useRecurringBills', () => ({
  useRecurringBills: () => ({
    bills: [],
    totalPages: 2,
    currentPage: 1,
    goToPage: goToPageMock,
    pending: false,
    search: '',
    selectedSort: '',
    summary: {
      totalBills: 1000,
      paidBills: 500,
      dueSoon: 300,
      upcoming: 200,
    },
  }),
}));

describe('RecurringBills', () => {
  const factory = () =>
    mount(RecurringBills, {
      global: {
        stubs: {
          TitleSection: {
            props: ['title'],
            template: '<h1>{{ title }}</h1>',
          },
          SummaryCard: true,
          Filter: true,
          Table: true,
          Pagination: {
            props: ['currentPage', 'totalPages'],
            emits: ['page-change'],
            template: `
              <button data-testid="pagination" @click="$emit('page-change', 2)">
                Pagination
              </button>
            `,
          },
        },
      },
    });

  it('Should render page title correctly', () => {
    const wrapper = factory();

    expect(wrapper.text()).toContain('Contas Recorrentes');
  });

  it('Should render SummaryCard component', () => {
    const wrapper = factory();

    expect(wrapper.findComponent({ name: 'SummaryCard' }).exists()).toBe(true);
  });

  it('Should render Filter component', () => {
    const wrapper = factory();

    expect(wrapper.findComponent({ name: 'Filter' }).exists()).toBe(true);
  });

  it('Should render Table component', () => {
    const wrapper = factory();

    expect(wrapper.findComponent({ name: 'Table' }).exists()).toBe(true);
  });

  it('Should render Pagination when totalPages is greater than 1', () => {
    const wrapper = factory();

    expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true);
  });

  it('Should call goToPage when pagination emits page-change', async () => {
    const wrapper = factory();

    await wrapper.find('[data-testid="pagination"]').trigger('click');

    expect(goToPageMock).toHaveBeenCalledWith(2);
  });
});
