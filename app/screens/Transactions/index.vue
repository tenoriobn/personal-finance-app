<template>
  <div class="grid max-md:gap-8 md:gap-10">
    <h2 class="text-grey-900 text-[2rem] font-bold leading-none">Transactions</h2>

    <div class="bg-white rounded-xl h-full max-md:p-4 md:p-10 w-full overflow-hidden">
      <Filter />
      <Table />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Table from './Table.vue';
import Filter from './Filter/index.vue';
</script>
