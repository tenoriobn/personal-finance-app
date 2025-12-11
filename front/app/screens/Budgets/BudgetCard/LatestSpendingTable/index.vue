<template>
  <div class="bg-beige-100 rounded-xl mt-6 p-4">
    <table class="w-full">
      <thead class="text-grey-500">
        <tr class="flex justify-between items-center gap-4 pb-2">
          <th
            scope="col"
            class="truncate text-sm font-normal"
          >
            <h3 class="max-sm:text-base text-xl font-bold text-grey-900">Últimos gastos</h3>
          </th>

          <th scope="col">
            <NuxtLink
              to="/transacoes"
              class="group flex items-center gap-2 text-sm font-normal hover:text-grey-900 active:text-grey-300 duration-150 ease-in-out"
              @click="selectedCategory = categoryId"
            >
              Ver todos
              <CaretDownIcon class="fill-grey-500 group-hover:fill-grey-900 group-active:fill-grey-300 -rotate-90 duration-150 ease-in-out" />
            </NuxtLink>
          </th>
        </tr>
      </thead>

      <tbody class="divide-y text-grey-500 text-sm text-wrap">
        <tr v-if="transactions.length === 0">
          <td
            colspan="3"
            class="text-center text-grey-500 text-sm py-10"
          >
            Não há transações.
          </td>
        </tr>

        <tr
          v-for="transaction in transactions || []"
          v-else
          :key="transaction.id"
          class="grid grid-cols-[1fr_auto] grid-rows-2 items-center max-sm:gap-2 sm:gap-x-4 py-4 last:pb-0"
        >
          <td class="row-span-2 flex items-center max-sm:gap-2 sm:gap-4 text-grey-900 font-bold">
            <span
              class="max-sm:w-8 max-sm:h-8 sm:w-10 sm:h-10 rounded-full grid place-items-center text-grey-100 bg-amber-500"
            >
              {{ transaction.name[0] }}
            </span>

            <span class="truncate">
              {{ transaction.name }}
            </span>
          </td>

          <td class="col-start-3 row-start-2 text-right font-normal truncate">
            {{ formatDate(transaction.date) }}
          </td>

          <td
            class="col-start-3 row-start-1 text-right font-bold truncate"
            :class="transaction.amount > 0 ? 'text-green' : 'text-red'"
          >
            {{ formatCurrency(transaction.amount) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import CaretDownIcon from '~/assets/icons/icon-caret-down.svg';
import { NuxtLink } from '#components';
import type { LatestSpendingTableProps } from './latestSpendingTable.type';
import { formatDate, formatCurrency } from '~/utils';
import { useTransactionsFilters } from '~/composables';

const { transactions, categoryId } = defineProps<LatestSpendingTableProps>();
const { selectedCategory } = useTransactionsFilters();
</script>
