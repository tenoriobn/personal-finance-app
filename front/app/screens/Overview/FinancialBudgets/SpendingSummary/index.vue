<template>
  <div
    v-if="pending"
    class="w-44 h-7 justify-self-start mt-6 bg-grey-200 rounded animate-pulse"
  />

  <div
    class="grid items-center max-sm:gap-2 sm:gap-x-4"
  >
    <div
      v-for="budget in (budgets || []).slice(0, 4)"
      :key="budget.id"
      class="relative  pl-4 flex items-center max-sm:gap-2 sm:gap-4"
    >
      <span
        class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg"
        :style="{ backgroundColor: budget.theme.colorHex || '#ccc' }"
      />

      <div class="grid gap-1">
        <p class="text-sm text-grey-500">{{ budget.category.name }}</p>
        <p class="text-sm text-grey-900 font-bold">{{ formatCurrency(159, false) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils';
import { useBudgets } from '~/screens/Budgets/useBudgets';

const { budgets, pending } = useBudgets();
</script>
