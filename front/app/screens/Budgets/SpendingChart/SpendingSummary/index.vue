<template>
  <h3 class="text-xl font-bold text-grey-900 justify-self-start mt-6">Resumo de gastos</h3>

  <table>
    <tbody class="divide-y text-grey-500 text-sm text-wrap">
      <tr
        v-for="budget in (budgets || []).slice(0, 3)"
        :key="budget.id"
        class="grid grid-cols-[1fr_auto] items-center max-sm:gap-2 sm:gap-x-4 py-4 last:pb-0"
      >
        <td class="relative row-span-2 pl-4 flex items-center max-sm:gap-2 sm:gap-4 text-grey-900 font-bold">
          <span
            class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg"
            :style="{ backgroundColor: budget.theme.colorHex || '#ccc' }"
          />
          <p class="text-sm text-grey-500">{{ budget.category.name }}</p>
        </td>

        <td class="col-start-3 row-span-2 sm:flex sm:items-end sm:gap-1">
          <p class="text-base text-grey-900 font-bold">{{ formatCurrency(getSpent(budget.transactions), false) }}</p>
          <p class="text-sm text-grey-500 text-nowrap text-end">de {{ formatCurrency(budget.maximumSpend, false) }}</p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { getSpent } from '~/utils/finance';
import { formatCurrency } from '~/utils';
import { useBudgets } from '../../useBudgets';

const { budgets } = useBudgets();
</script>
