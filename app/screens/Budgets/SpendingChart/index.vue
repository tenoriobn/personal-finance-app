<template>
  <div class="relative">
    <div class="xl:sticky xl:top-10 flex flex-col h-max  bg-white rounded-xl max-md:p-4 md:p-[2rem]">
      <div>
        <Doughnut
          :data="chartData"
          :options="chartOptions"
          :plugins="[centerTextPlugin]"
        />
      </div>

      <SpendingSummary />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartOptions, Plugin } from 'chart.js';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import type { SpendingChartProps } from './spendingChart.type';
import SpendingSummary from './SpendingSummary/index.vue';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const { budgets } = defineProps<SpendingChartProps>();

const chartData = computed(() => ({
  labels: budgets.map(b => b.category),
  datasets: [
    {
      data: budgets.map(b => b.maximum),
      backgroundColor: budgets.map(b => b.theme),
      borderWidth: 0,
    },
  ],
}));

const centerTextPlugin: Plugin<'doughnut'> = {
  id: 'centerText',
  beforeDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!ctx || !chartArea) {
      return;
    }

    ctx.save();

    const firstLine = 'R$2.400';
    const secondLine = 'of $5.000 limit';

    const firstFontSize = 24;
    const secondFontSize = 14;
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
</script>
