<template>
  <div class="grid md:gap-6 bg-white rounded-xl max-md:p-4 md:p-10 w-full">
    <div class="flex justify-between items-center gap-4">
      <h3 class="max-sm:text-base text-xl font-bold text-grey-900">Orçamentos</h3>

      <NuxtLink
        to="/orcamentos"
        class="group text-grey-500 flex items-center gap-2 text-sm font-normal hover:text-grey-900 active:text-grey-300 duration-150 ease-in-out"
      >
        Ver todos
        <CaretDownIcon class="fill-grey-500 group-hover:fill-grey-900 group-active:fill-grey-300 -rotate-90 duration-150 ease-in-out" />
      </NuxtLink>
    </div>

    <div class="flex gap-4 w-full">
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

<script lang="ts" setup>
import CaretDownIcon from '~/assets/icons/icon-caret-down.svg';
import { Doughnut } from 'vue-chartjs';
import SpendingSummary from './SpendingSummary/index.vue';
import { useChart } from './useChart';

const { chartData, chartOptions, centerTextPlugin } = useChart();
</script>
