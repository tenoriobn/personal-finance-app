import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import FinancialRecurringBills from './index.vue';
import type { OverviewRecurringBill } from '../overview.type';

const recurringBillsMock = ref<OverviewRecurringBill | null>(null);

const pendingMock = ref(false);

vi.mock('../useOverview', () => ({
  useOverview: () => ({
    recurringBills: recurringBillsMock,
    pending: pendingMock,
  }),
}));

const formatCurrencyMock = vi.fn();

vi.mock('~/utils', () => ({
  formatCurrency: (...args: Parameters<typeof formatCurrencyMock>) =>
    formatCurrencyMock(...args),
}));

const globalMountOptions = {
  global: {
    stubs: {
      NuxtLink: {
        template: '<a :href="to"><slot /></a>',
        props: ['to'],
      },
      CaretDownIcon: true,
    },
  },
};

describe('Overview > FinancialRecurringBills', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pendingMock.value = false;
    recurringBillsMock.value = null;
  });

  it('Should render section title', () => {
    const wrapper = mount(FinancialRecurringBills, globalMountOptions);

    expect(wrapper.text()).toContain('Contas Recorrentes');
  });

  it('Should render link to recurring bills page', () => {
    const wrapper = mount(FinancialRecurringBills, globalMountOptions);

    const link = wrapper.find('a[href="/contas-recorrentes"]');

    expect(link.exists()).toBe(true);
    expect(link.text()).toContain('Ver todos');
  });

  it('Should render skeletons when pending', () => {
    pendingMock.value = true;

    const wrapper = mount(FinancialRecurringBills, globalMountOptions);

    const skeletons = wrapper.findAll('.animate-pulse');

    expect(skeletons.length).toBe(3);
  });

  it('Should render formatted values when not pending', () => {
    recurringBillsMock.value = {
      paidBills: 100,
      dueSoon: 200,
      upcoming: 300,
    };

    formatCurrencyMock.mockReturnValue('R$ 100,00');

    mount(FinancialRecurringBills, globalMountOptions);

    expect(formatCurrencyMock).toHaveBeenCalledWith(100, false);
    expect(formatCurrencyMock).toHaveBeenCalledWith(200, false);
    expect(formatCurrencyMock).toHaveBeenCalledWith(300, false);
  });

  it('Should render all recurring bill categories', () => {
    recurringBillsMock.value = {
      paidBills: 50,
      dueSoon: 75,
      upcoming: 125,
    };

    formatCurrencyMock.mockReturnValue('R$ 0,00');

    const wrapper = mount(FinancialRecurringBills, globalMountOptions);

    expect(wrapper.text()).toContain('Contas pagas');
    expect(wrapper.text()).toContain('A vencer em 5 dias');
    expect(wrapper.text()).toContain('Próximos vencimentos');
  });

  it('Should apply correct background color to each category', () => {
    recurringBillsMock.value = {
      paidBills: 10,
      dueSoon: 20,
      upcoming: 30,
    };

    formatCurrencyMock.mockReturnValue('R$ 0,00');

    const wrapper = mount(FinancialRecurringBills, globalMountOptions);

    const articles = wrapper.findAll('article');

    expect(articles[0]!.attributes('style')).toContain(
      'background-color: #277C78',
    );
    expect(articles[1]!.attributes('style')).toContain(
      'background-color: #82C9D7',
    );
    expect(articles[2]!.attributes('style')).toContain(
      'background-color: #F2CDAC',
    );
  });

  it('Should fallback to zero when recurringBills is null', () => {
    formatCurrencyMock.mockReturnValue('R$ 0,00');

    mount(FinancialRecurringBills, globalMountOptions);

    expect(formatCurrencyMock).toHaveBeenCalledWith(0, false);
  });
});
