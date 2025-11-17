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
import { useChart } from './useChart';
import SpendingChartSkeleton from './SpendingChartSkeleton.vue';

const { chartData, chartOptions, centerTextPlugin, pending } = useChart();
const chartReady = ref(false);
</script>
