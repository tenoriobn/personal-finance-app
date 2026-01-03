import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, computed } from 'vue';
import SpendingChart from './index.vue';
import type { BudgetData } from '../budgets.type';

const budgetsMock = ref<BudgetData[]>([]);
const pendingMock = ref(false);

vi.mock('../useBudgets', () => ({
  useBudgets: () => ({
    budgets: budgetsMock,
    pending: pendingMock,
  }),
}));

const chartDataMock = computed(() => ({
  labels: ['Alimentação'],
  datasets: [
    {
      data: [500],
      backgroundColor: ['#00FF00'],
      borderWidth: 0,
    },
  ],
}));

const chartOptionsMock = {
  responsive: true,
};

const centerTextPluginMock = {
  id: 'centerText',
};

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
    template: '<div data-testid="doughnut-chart" />',
    props: ['data', 'options', 'plugins'],
  },
}));

describe('SpendingChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    budgetsMock.value = [];
    pendingMock.value = false;
  });

  it('Should render skeleton when pending', () => {
    pendingMock.value = true;

    const wrapper = mount(SpendingChart);

    expect(wrapper.findComponent({ name: 'SpendingChartSkeleton' }).exists()).toBe(true);
    expect(wrapper.find('[data-testid="doughnut-chart"]').exists()).toBe(false);
  });

  it('Should render Doughnut chart when not pending', () => {
    const wrapper = mount(SpendingChart);

    expect(wrapper.find('[data-testid="doughnut-chart"]').exists()).toBe(true);
  });

  it('Should pass correct props to Doughnut component', () => {
    const wrapper = mount(SpendingChart);

    const doughnutComponent = wrapper.findComponent({ name: 'Doughnut' });

    expect(doughnutComponent.exists()).toBe(true);
    expect(doughnutComponent.props('data')).toEqual(chartDataMock.value);
    expect(doughnutComponent.props('options')).toBe(chartOptionsMock);
    expect(doughnutComponent.props('plugins')).toEqual([centerTextPluginMock]);
  });

  it('Should always render SpendingSummary', () => {
    const wrapper = mount(SpendingChart);

    expect(wrapper.text()).toContain('Resumo de gastos');
  });
});
