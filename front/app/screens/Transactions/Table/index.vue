<template>
  <table class="w-full">
    <thead class="max-xl:hidden text-grey-500 text-nowrap">
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

    <tbody class="divide-y divide-grey-100 text-grey-500 text-sm text-wrap">
      <TableSkeleton
        v-if="pending"
      />

      <p
        v-else-if="transactions.length === 0"
        class="text-center text-grey-500 text-sm xl:pt-10"
      >
        No transactions found.
      </p>

      <tr
        v-for="{ avatar, name, category, date, amount } in transactions || []"
        v-else
        :key="date"
        class="grid max-xl:grid-cols-[auto_1fr_auto] xl:grid-cols-[minmax(300px,1fr)_140px_140px_minmax(100px,1fr)] max-xl:grid-rows-2 items-center max-xl:gap-x-4 xl:gap-6 py-4 last:pb-0"
      >
        <td
          class="max-xl:row-span-2 flex items-center gap-4 text-grey-900 font-bold"
        >
          <img
            :src="`${avatar}`"
            :alt="`Avatar da {{avatar}}`"
            class="w-10 h-10 rounded-full"
          >
          <span
            class="max-xl:hidden truncate"
            :title="name"
          >
            {{ name }}
          </span>
        </td>

        <td
          class="max-xl:col-start-2 max-xl:row-start-1 xl:hidden flex items-center gap-4 text-grey-900 font-bold min-w-0"
        >
          <span
            class="truncate max-w-full block"
            :title="name"
          >
            {{ name }}
          </span>
        </td>

        <td
          class="max-xl:col-start-2 max-xl:row-start-2 font-normal truncate"
          :title="category"
        >
          {{ category }}
        </td>
        <td
          class="max-xl:col-start-3 max-xl:row-start-2 font-normal truncate"
        >
          {{ formatDate(date) }}
        </td>
        <td
          class="max-xl:col-start-3 max-xl:row-start-1 text-right font-bold truncate"
          :class="amount > 0 ? 'text-green' : 'text-grey-900'"
        >
          {{ formatCurrency(amount) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import TableSkeleton from './TableSkeleton.vue';
import { formatDate, formatCurrency } from '~/utils';
import type { TableProps } from './table.type';

const { transactions, pending } = defineProps<TableProps>();

const tableHeaders = [
  { id: 1, title: 'Destinatário/Remetente' },
  { id: 2, title: 'Categoria' },
  { id: 3, title: 'Data da transação' },
  { id: 4, title: 'Valor', align: 'text-right' },
];
</script>
