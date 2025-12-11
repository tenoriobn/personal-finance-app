<template>
  <div class="relative">
    <div class="xl:sticky xl:top-10 flex flex-col h-max  bg-white rounded-xl max-md:p-4 md:p-[2rem]">
      <SpendingChartSkeleton v-if="pending" />

      <div v-else>
        <Doughnut
          :data="chartData"
          :options="chartOptions"
          :plugins="[centerTextPlugin]"
          @chart:render="chartReady = true"
        />
      </div>

      <SpendingSummary />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs';
import SpendingSummary from './SpendingSummary/index.vue';
import { useChart } from '~/composables';
import SpendingChartSkeleton from './SpendingChartSkeleton.vue';
import { useBudgets } from '../useBudgets';

const { budgets, pending } = useBudgets();

const { chartData, chartOptions, centerTextPlugin } = useChart(budgets);
const chartReady = ref(false);
</script>
