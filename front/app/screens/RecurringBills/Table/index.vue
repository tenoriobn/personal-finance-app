<template>
  <table>
    <thead class="max-md:hidden text-grey-500 text-nowrap">
      <tr class="grid md:grid-cols-[minmax(172px,1fr)_140px_minmax(90px,1fr)] gap-6">
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

      <tr v-else-if="recurringBills.length === 0">
        <td
          colspan="3"
          class="text-center text-grey-500 text-sm max-md:py-10 xl:pt-10"
        >
          Não há transações.
        </td>
      </tr>

      <tr
        v-for="{ name, date, amount, status } in recurringBills || []"
        v-else
        :key="date"
        class="grid items-center max-md:grid-cols-[auto_1fr_auto] max-md:grid-rows-2 max-md:gap-x-4 md:grid-cols-[minmax(172px,1fr)_140px_minmax(90px,1fr)] md:gap-6 py-4 last:pb-0"
      >
        <td
          class="max-md:col-start-1 max-md:col-end-3 max-md:row-span-2 flex items-center gap-4 text-grey-900 font-bold"
        >
          <span
            class="w-10 h-10 rounded-full grid place-items-center text-grey-100 bg-amber-500"
          >
            {{ name[0] }}
          </span>

          <span
            class="truncate"
            :title="name"
          >
            {{ name }}
          </span>
        </td>

        <td
          class="max-md:col-start-3 max-md:row-start-2 flex items-center gap-1 font-normal truncate"
          :class="status === 'paid' ? 'text-green' : status === 'dueSoon' ? 'text-red' : 'text-grey-500'"
        >
          <p class="max-md:order-2">{{ formatMonthDay(date) }}</p>

          <div class="max-md:order-1">
            <BillPaidIcon v-if="status === 'paid'" />
            <BillDueIcon v-if="status==='dueSoon'" />
          </div>
        </td>

        <td
          class="max-md:col-start-3 max-md:row-start-1 text-right font-bold truncate"
          :class="amount > 0 ? 'text-grey-900' : 'text-red'"
        >
          {{ formatCurrency(amount, false) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import TableSkeleton from './TableSkeleton.vue';
import { formatMonthDay, formatCurrency } from '~/utils';
import type { RecurringBillsTableProps } from './table.type';
import BillPaidIcon from '~/assets/icons/icon-bill-paid.svg';
import BillDueIcon from '~/assets/icons/icon-bill-due.svg';

const { recurringBills, pending } = defineProps<RecurringBillsTableProps>();

const tableHeaders = [
  { id: 1, title: 'Destinatário/Remetente' },
  { id: 3, title: 'Data de vencimento' },
  { id: 4, title: 'Valor', align: 'text-right' },
];
</script>
