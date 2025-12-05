<template>
  <div class="bg-white rounded-xl max-md:p-4 md:p-10 w-full">
    <table class="w-full">
      <thead class="text-grey-500">
        <tr class="flex justify-between items-center gap-4 pb-2">
          <th
            scope="col"
            class="truncate text-sm font-normal"
          >
            <h3 class="max-sm:text-base text-xl font-bold text-grey-900">Transações</h3>
          </th>

          <th scope="col">
            <NuxtLink
              to="/transacoes"
              class="group flex items-center gap-2 text-sm font-normal hover:text-grey-900 active:text-grey-300 duration-150 ease-in-out"
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
import { useOverview } from '../useOverview';

const { summaryTransactions } = useOverview();
const transactions = summaryTransactions.value?.transactions ?? [];
//   {
//     id: '692f03ffa92189a2ee95f33c',
//     name: 'Alex Poatan',
//     date: '2025-12-08T03:00:00.000Z',
//     amount: 250,
//     recurring: true,
//     userId: '68cc2ec3f0818350607a26b6',
//     budgetId: '68e5679bde9ef6eb4d207be1',
//   },
//   {
//     id: '692ef8856b090fa57c8ad88b',
//     name: 'Bruno Tenorio',
//     date: '2025-12-04T03:00:00.000Z',
//     amount: 150,
//     recurring: true,
//     userId: '68cc2ec3f0818350607a26b6',
//     budgetId: '68e5679bde9ef6eb4d207be1',
//   },
//   {
//     id: '692f0462a92189a2ee95f33d',
//     name: 'Alex Poatan',
//     date: '2025-12-01T03:00:00.000Z',
//     amount: 250,
//     recurring: true,
//     userId: '68cc2ec3f0818350607a26b6',
//     budgetId: '68e5679bde9ef6eb4d207be1',
//   },
//   {
//     id: '692f0462a92189a2ee95f32c',
//     name: 'Correa Neto',
//     date: '2025-12-01T03:00:00.000Z',
//     amount: 250,
//     recurring: true,
//     userId: '68cc2ec3f0818350607a26b6',
//     budgetId: '68e5679bde9ef6eb4d207be1',
//   },
//   {
//     id: '692f0462a92189a2ee95f43e',
//     name: 'Alex Poatan',
//     date: '2025-12-01T03:00:00.000Z',
//     amount: 250,
//     recurring: true,
//     userId: '68cc2ec3f0818350607a26b6',
//     budgetId: '68e5679bde9ef6eb4d207be1',
//   },
// ];
</script>
