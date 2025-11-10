<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Orçamentos" />
      <Button
        label="+Novo Orçamento"
        @click="showCreateBudgetModal = true"
      />
    </header>

    <div class="grid grid-cols-1 gap-4 xl:max-2xl:grid-cols-[minmax(0,400px)_1fr] 2xl:grid-cols-[minmax(0,480px)_1fr]">
      <SpendingChart :budgets="budgets" />

      <div class="grid gap-4">
        <BudgetCard />
        <BudgetCard />
        <BudgetCard />
      </div>

      <CreateBudgetModal v-model="showCreateBudgetModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, TitleSection } from '#components';
import SpendingChart from './SpendingChart/index.vue';
import BudgetCard from './BudgetCard/index.vue';
import CreateBudgetModal from './CreateBudgetModal/index.vue';
import { useBudgets, useBudgetsTest } from './useBudgets';

const { budgets } = useBudgets();
const showCreateBudgetModal = ref(false);

useBudgetsTest();
</script>
