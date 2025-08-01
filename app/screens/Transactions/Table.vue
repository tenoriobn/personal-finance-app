<template>
  <div class="w-full rounded-xl overflow-x-auto">
    <table class="w-full divide-y divide-grey-100">
      <thead class="text-grey-500 text-nowrap">
        <tr>
          <th
            v-for="{ id, title, align } in tableHeaders || []"
            :key="id"
            class="text-sm font-normal pb-6"
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
        >
          <td class="flex items-center gap-4 text-grey-900 font-semibold pr-6 py-6">
            <img
              :src="`../${avatar}`"
              :alt="`Avatar da {{avatar}}`"
              class="w-10 h-10 rounded-full"
            >
            {{ name }}
          </td>
          <td class="font-normal pr-6 py-6">{{ category }}</td>
          <td class="font-normal pr-6 py-6">{{ formatDate(date) }}</td>
          <td
            class="text-right font-semibold py-6"
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
