import type { ChartOptions, Plugin } from 'chart.js';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useBudgets } from '../useBudgets';
import { formatCurrency } from '~/utils';
import { getSpent } from '~/utils/finance';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export function useChart() {
  const { budgets } = useBudgets();

  const chartData = computed(() => ({
    labels: budgets.value.map(b => b.category.name),
    datasets: [
      {
        data: budgets.value.map(b => b.maximumSpend),
        backgroundColor: budgets.value.map(b => b.theme.colorHex),
        borderWidth: 0,
      },
    ],
  }));

  const totalMaximumSpend = computed(() =>
    budgets.value.reduce((acc, b) => acc + (b.maximumSpend || 0), 0),
  );

  const totalSpent = computed(() =>
    budgets.value.reduce((acc, b) => acc + getSpent(b.transactions), 0),
  );

  const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!ctx || !chartArea) {
        return;
      }

      const spent = formatCurrency(totalSpent.value, false);
      const max = formatCurrency(totalMaximumSpend.value, false);

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
  };

  return {
    chartData,
    chartOptions,
    centerTextPlugin,
  };
}
