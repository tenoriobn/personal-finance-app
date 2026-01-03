import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import FinancialBudgets from './index.vue';
import type { OverviewBudget } from '../overview.type';

const summaryBudgetsMock = ref<OverviewBudget[] | null>([]);
const pendingMock = ref(false);

vi.mock('../useOverview', () => ({
  useOverview: () => ({
    summaryBudgets: summaryBudgetsMock,
    pending: pendingMock,
  }),
}));

const chartDataMock = ref({ labels: [], datasets: [] });
const chartOptionsMock = { responsive: true };
const centerTextPluginMock = { id: 'centerText' };

vi.mock('~/composables', () => ({
  useChart: () => ({
    chartData: chartDataMock,
    chartOptions: chartOptionsMock,
    centerTextPlugin: centerTextPluginMock,
  }),
}));

vi.mock('vue-chartjs', () => ({
  Doughnut: {
    name: 'Doughnut',
    template: '<div class="doughnut-mock" />',
    props: ['data', 'options', 'plugins'],
  },
}));

vi.mock('./SpendingSummary/index.vue', () => ({
  default: {
    name: 'SpendingSummary',
    template: '<div data-testid="spending-summary" />',
  },
}));

vi.mock('./FinancialBudgetsChartSkeleton.vue', () => ({
  default: {
    name: 'FinancialBudgetsChartSkeleton',
    template: '<div data-testid="chart-skeleton" />',
  },
}));

const globalMountOptions = {
  global: {
    stubs: {
      NuxtLink: {
        template: '<a :href="to"><slot /></a>',
        props: ['to'],
      },
    },
  },
};

describe('Overview > FinancialBudgets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    summaryBudgetsMock.value = [];
    pendingMock.value = false;
  });

  it('Should render section title', () => {
    const wrapper = mount(FinancialBudgets, globalMountOptions);

    expect(wrapper.text()).toContain('Orçamentos');
  });

  it('Should render link to budgets page', () => {
    const wrapper = mount(FinancialBudgets, globalMountOptions);

    const link = wrapper.find('a[href="/orcamentos"]');

    expect(link.exists()).toBe(true);
    expect(link.text()).toContain('Ver todos');
  });

  it('Should render skeleton when pending', () => {
    pendingMock.value = true;

    const wrapper = mount(FinancialBudgets, globalMountOptions);

    expect(wrapper.find('[data-testid="chart-skeleton"]').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'Doughnut' }).exists()).toBe(false);
  });

  it('Should render Doughnut chart when not pending', () => {
    const wrapper = mount(FinancialBudgets, globalMountOptions);

    expect(wrapper.findComponent({ name: 'Doughnut' }).exists()).toBe(true);
    expect(wrapper.find('[data-testid="chart-skeleton"]').exists()).toBe(false);
  });

  it('Should pass correct props to Doughnut component', () => {
    const wrapper = mount(FinancialBudgets, globalMountOptions);
    const doughnut = wrapper.findComponent({ name: 'Doughnut' });

    expect(doughnut.exists()).toBe(true);
    expect(doughnut.props('data')).toBe(chartDataMock.value);
    expect(doughnut.props('options')).toBe(chartOptionsMock);
    expect(doughnut.props('plugins')).toEqual([centerTextPluginMock]);
  });

  it('Should render SpendingSummary component', () => {
    const wrapper = mount(FinancialBudgets, globalMountOptions);

    expect(wrapper.find('[data-testid="spending-summary"]').exists()).toBe(true);
  });
});
