import type { ChartOptions, Plugin } from 'chart.js';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { formatCurrency } from '~/utils';
import { calculateSpent } from '~/utils/calculations';
import type { MinimalBudget } from './useChart.type';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export function useChart(budgets: Ref<MinimalBudget[]>) {
  function calculateTotalSpent(): number {
    let total = 0;
    for (const budget of budgets.value) {
      total += calculateSpent(budget.transactions);
    }
    return total;
  }

  function calculateTotalMaximumSpend(): number {
    let total = 0;
    for (const budget of budgets.value) {
      total += budget.maximumSpend || 0;
    }
    return total;
  }

  function getCenterText(): { spentText: string, maxText: string } {
    const spentText = formatCurrency(calculateTotalSpent(), false);
    const maxText = formatCurrency(calculateTotalMaximumSpend(), false);
    return { spentText, maxText };
  }

  function drawCenterText(
    ctx: CanvasRenderingContext2D,
    chartArea: { left: number, right: number, top: number, bottom: number },
    spentText: string,
    maxText: string,
  ): void {
    const firstFontSize = 18;
    const secondFontSize = 12;
    const lineGap = 4;
    const fontFamily = '"Public Sans", sans-serif';

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    const totalTextHeight = firstFontSize + lineGap + secondFontSize;
    const startY = centerY - totalTextHeight / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    ctx.font = `bold ${firstFontSize}px ${fontFamily}`;
    ctx.fillStyle = 'hsl(252, 7%, 13%)';
    ctx.fillText(spentText, centerX, startY);

    ctx.font = `${secondFontSize}px ${fontFamily}`;
    ctx.fillStyle = 'hsl(0, 0%, 41%)';
    ctx.fillText(maxText, centerX, startY + firstFontSize + lineGap);

    ctx.restore();
  }

  const chartData = computed(() => {
    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColor: string[] = [];

    for (const budget of budgets.value) {
      labels.push(budget.category.name);
      data.push(budget.maximumSpend);
      backgroundColor.push(budget.theme.colorHex);
    }

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 0,
        },
      ],
    };
  });

  const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!ctx || !chartArea) {
        return;
      }

      const { spentText, maxText } = getCenterText();
      drawCenterText(ctx, chartArea, spentText, maxText);
    },
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label({ raw }) {
            return formatCurrency(raw as number, false);
          },
        },
      },
    },
  };

  return {
    chartData,
    chartOptions,
    centerTextPlugin,
  };
}
