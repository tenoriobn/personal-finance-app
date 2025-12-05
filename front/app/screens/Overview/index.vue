<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Visão Geral" />
      <Button
        label="Sair"
        @click="logout = true"
      >
        <LogoutIcon class="" />
      </Button>
    </header>

    <FinancialSummaryCard />
    <FinancialPots />
    <FinancialTransactions />
    <FinancialBudgets />
    <FinancialRecurringBills />
  </div>
</template>

<script setup lang="ts">
import { Button, TitleSection } from '#components';
import LogoutIcon from '~/assets/icons/icon-logout.svg';
import FinancialSummaryCard from './FinancialSummaryCard/index.vue';
import FinancialPots from './FinancialPots/index.vue';
import FinancialTransactions from './FinancialTransactions/index.vue';
import FinancialBudgets from './FinancialBudgets/index.vue';
import FinancialRecurringBills from './FinancialRecurringBills/index.vue';
import { useOverview } from './useOverview';

const logout = ref(false);

const { loadOverview } = useOverview();
loadOverview();
</script>
