import type { ChartOptions, Plugin } from 'chart.js';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { formatCurrency } from '~/utils';
import { getSpent } from '~/utils/finance';
import { useOverview } from '../useOverview';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export function useChart() {
  const { summaryBudgets, pending } = useOverview();

  const chartData = computed(() => ({
    labels: summaryBudgets.value?.budgets.map(budget => budget.category.name) ?? [],
    datasets: [
      {
        data: summaryBudgets.value?.budgets.map(budget => budget.maximumSpend) ?? [],
        backgroundColor: summaryBudgets.value?.budgets.map(budget => budget.theme.colorHex) ?? [],
        borderWidth: 0,
      },
    ],
  }));

  const totalMaximumSpend = computed(() =>
    summaryBudgets.value?.budgets.reduce((acc, budget) => acc + (budget.maximumSpend || 0), 0),
  );

  const totalSpent = computed(() =>
    summaryBudgets.value?.budgets.reduce((acc, budget) => acc + getSpent(budget.transactions), 0),
  );

  const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!ctx || !chartArea) {
        return;
      }

      const spent = formatCurrency(totalSpent.value || 0, false);
      const max = formatCurrency(totalMaximumSpend.value || 0, false);

      ctx.save();

      const firstLine = spent;
      const secondLine = `de ${max}`;

      const firstFontSize = 18;
      const secondFontSize = 12;
      const lineGap = 4;
      const fontFamily = '"Public Sans", sans-serif';

      const { left, right, top, bottom } = chartArea;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      ctx.textAlign = 'center';
      ctx.fillStyle = 'hsl(252, 7%, 13%)';

      const totalTextHeight = firstFontSize + lineGap + secondFontSize;
      const startY = centerY - totalTextHeight / 2;

      ctx.font = `bold ${firstFontSize}px ${fontFamily}`;
      ctx.textBaseline = 'top';
      ctx.fillText(firstLine, centerX, startY);

      ctx.font = `${secondFontSize}px ${fontFamily}`;
      ctx.fillStyle = 'hsl(0, 0%, 41%)';
      ctx.fillText(secondLine, centerX, startY + firstFontSize + lineGap);

      ctx.restore();
    },
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(context) {
            const value = context.raw as number;

            return `${formatCurrency(value, false)}`;
          },
        },
      },
    },
  };

  return {
    chartData,
    chartOptions,
    centerTextPlugin,
    pending,
  };
}
