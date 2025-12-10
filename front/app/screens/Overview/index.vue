<template>
  <section class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Visão Geral" />
      <Button
        label="Sair"
        @click="handleLogout"
      >
        <LogoutIcon class="" />
      </Button>
    </header>

    <FinancialSummaryCard />

    <div class="columns-1 xl:columns-2 gap-4 space-y-4">
      <div class="break-inside-avoid">
        <FinancialPots />
      </div>

      <div class="break-inside-avoid">
        <FinancialTransactions />
      </div>

      <div class="break-inside-avoid">
        <FinancialBudgets />
      </div>

      <div class="break-inside-avoid">
        <FinancialRecurringBills />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button, TitleSection } from '#components';
import LogoutIcon from '~/assets/icons/icon-logout.svg';
import FinancialSummaryCard from './FinancialSummaryCard/index.vue';
import FinancialPots from './FinancialPots/index.vue';
import FinancialTransactions from './FinancialTransactions/index.vue';
import FinancialBudgets from './FinancialBudgets/index.vue';
import FinancialRecurringBills from './FinancialRecurringBills/index.vue';

import { useAuth } from '~/composables/useAuth';

const { clearToken } = useAuth();

const handleLogout = () => {
  clearToken();
  navigateTo('/login');
};
</script>
