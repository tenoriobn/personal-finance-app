<template>
  <div class="relative">
    <div class="xl:sticky xl:top-10 flex flex-col h-max mb-4 bg-white rounded-xl max-md:p-4 md:p-[2rem]">
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
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import type { SpendingChartProps } from './spendingChart.type';
import SpendingSummary from './SpendingSummary/index.vue';
import { useSpendingChart } from './useSpendingChart';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const { budgets } = defineProps<SpendingChartProps>();

const { chartData, chartOptions, centerTextPlugin } = useSpendingChart(budgets);
</script>
