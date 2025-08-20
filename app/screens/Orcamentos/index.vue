<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Orçamentos" />
      <Button label="+Novo Orçamento" />
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SpendingChart :budgets="budgets" />
      <div class="bg-white rounded-xl h-[350px] mb-4" />
      <div class="bg-white rounded-xl h-[320px] mb-4" />
      <div class="bg-white rounded-xl h-[350px] mb-4" />
      <div class="bg-white rounded-xl h-[380px] mb-4" />
      <div class="bg-white rounded-xl h-[350px] mb-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, TitleSection } from '#components';
import SpendingChart from './SpendingChart/index.vue';
import { useBudgets } from './useBudgets';

const { budgets } = useBudgets();
</script>
