<template>
  <div class="bg-white rounded-xl max-md:p-4 md:p-[2rem]">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span class="block bg-green w-4 h-4 rounded-full" />
        <h3 class="text-xl font-bold text-grey-900">Entretenimento</h3>
      </div>

      <button class="opacity-50 hover:opacity-100 duration-150 ease-in-out">
        <DotsIcon />
      </button>
    </div>

    <p class="text-sm text-grey-500 mt-6">Máximo de R$3.000,00</p>

    <Progressbar />
    <BalanceOverview />
    <LatestSpendingTable />
  </div>
</template>

<script setup lang="ts">
import DotsIcon from '~/assets/icons/icon-dots.svg';
import LatestSpendingTable from './LatestSpendingTable/index.vue';
import Progressbar from './Progressbar/index.vue';
import BalanceOverview from './BalanceOverview/index.vue';
</script>
