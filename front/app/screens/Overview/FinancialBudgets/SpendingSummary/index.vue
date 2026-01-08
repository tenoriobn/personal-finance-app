<template>
  <div
    class="grid max-md:grid-cols-2 items-center gap-x-2 gap-y-4 h-max"
    data-testid="financial-budgets"
  >
    <SpendingSummarySkeleton v-if="pending" />

    <article
      v-for="budget in (summaryBudgets || []).slice(0, 4)"
      v-else
      :key="budget.id"
      class="relative  pl-4 flex items-center max-sm:gap-2 sm:gap-4"
    >
      <span
        class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg"
        :style="{ backgroundColor: budget.theme.colorHex || '#ccc' }"
      />

      <div class="grid gap-1">
        <h4 class="text-sm text-grey-500">{{ budget.category.name }}</h4>
        <p class="text-sm text-grey-900 font-bold">{{ formatCurrency(calculateSpent(budget.transactions), false) }}</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils';
import { useOverview } from '../../useOverview';
import SpendingSummarySkeleton from './SpendingSummarySkeleton.vue';
import { calculateSpent } from '~/utils/calculations';

const { summaryBudgets, pending } = useOverview();
</script>
