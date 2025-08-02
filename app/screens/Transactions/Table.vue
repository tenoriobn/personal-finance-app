<template>
  <div class="w-full rounded-xl overflow-x-auto">
    <table class="w-full divide-y divide-grey-100">
      <thead class="text-grey-500 text-nowrap">
        <tr class="grid grid-cols-[minmax(300px,1fr)_140px_140px_minmax(100px,1fr)] gap-6 w-full">
          <th
            v-for="{ id, title, align } in tableHeaders || []"
            :key="id"
            scope="col"
            class="truncate text-sm font-normal pb-4"
            :class="align || 'text-left'"
          >
            {{ title }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-grey-100 text-grey-500 text-sm text-nowrap">
        <tr
          v-for="{ avatar, name, category, date, amount } in transactions || []"
          :key="date"
          class="grid grid-cols-[minmax(300px,1fr)_140px_140px_minmax(100px,1fr)] items-center gap-6"
        >
          <td
            scope="row"
            class="flex items-center gap-4 text-grey-900 font-semibold py-4"
          >
            <img
              :src="`../${avatar}`"
              :alt="`Avatar da {{avatar}}`"
              class="w-10 h-10 rounded-full"
            >
            <span class="truncate max-w-full">
              {{ name }}
            </span>
          </td>
          <td
            scope="row"
            class="font-normal py-4 truncate max-w-full"
          >
            {{ category }}
          </td>
          <td
            scope="row"
            class="font-normal py-4 truncate max-w-full"
          >
            {{ formatDate(date) }}
          </td>
          <td
            scope="row"
            class="text-right font-semibold py-4 truncate max-w-full"
            :class="amount > 0 ? 'text-green' : 'text-grey-900'"
          >
            {{ formatCurrency(amount) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '~/utils/formatDate';
import { formatCurrency } from '~/utils/formatCurrency';
import data from '~/data/data.json';

const { transactions } = data;

const tableHeaders = [
  { id: 1, title: 'Recipient/Sender' },
  { id: 2, title: 'Category' },
  { id: 3, title: 'Transaction Date' },
  { id: 4, title: 'Amount', align: 'text-right' },
];
</script>
