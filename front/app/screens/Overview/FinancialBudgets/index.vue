<template>
  <div class="grid gap-6 bg-white rounded-xl max-md:p-4 md:p-10 w-full">
    <div class="flex justify-between items-center gap-4">
      <h3 class="max-sm:text-base sm:text-xl font-bold text-grey-900">Orçamentos</h3>

      <NuxtLink
        to="/orcamentos"
        class="group text-grey-500 flex items-center gap-2 text-sm font-normal hover:text-grey-900 active:text-grey-300 duration-150 ease-in-out"
      >
        Ver todos
        <CaretDownIcon class="fill-grey-500 group-hover:fill-grey-900 group-active:fill-grey-300 -rotate-90 duration-150 ease-in-out" />
      </NuxtLink>
    </div>

    <div class="grid md:grid-cols-[1fr_auto] md:items-center gap-6 w-full">
      <div>
        <Doughnut
          class="max-sm:w-full"
          :data="chartData"
          :options="chartOptions"
          :plugins="[centerTextPlugin]"
        />
      </div>

      <SpendingSummary />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CaretDownIcon from '~/assets/icons/icon-caret-down.svg';
import { Doughnut } from 'vue-chartjs';
import SpendingSummary from './SpendingSummary/index.vue';
import { useChart } from './useChart';

const { chartData, chartOptions, centerTextPlugin } = useChart();
</script>

<style scoped>
.grid-column-1fr-auto {
  grid-template-columns: 1fr auto;
}
</style>
