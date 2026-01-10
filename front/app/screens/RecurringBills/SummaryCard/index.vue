<template>
  <div class="xl:sticky xl:top-10 w-full h-max flex flex-col md:max-xl:flex-row gap-4">
    <div class="flex max-md:items-center md:flex-col gap-4 bg-grey-900 rounded-xl max-md:p-4 md:p-[2rem] w-full shadow-lg shadow-grey-500/20">
      <RecurringBillsIcon class="fill-grey-100" />

      <div>
        <h3 class="grid md:gap-2 text-grey-100 text-base font-bold">
          Total de contas

          <div
            v-if="pending"
            class="w-36 h-9 bg-gray-200 rounded-md animate-pulse"
          />
          <span
            v-else
            class="text-3xl"
          >{{ formatCurrency(safeSummary.totalBills, false) }}</span>
        </h3>
      </div>
    </div>

    <div class="bg-white rounded-xl max-md:p-4 md:p-[2rem] w-full shadow-lg shadow-grey-500/20">
      <h3 class="text-xl font-bold text-grey-900 justify-self-start">Resumo</h3>

      <table class="w-full">
        <tbody class="divide-y divide-grey-100 text-grey-500 text-sm">
          <tr
            v-for="{ id, label, value } in billingDetails || []"
            :key="id"
            class="flex items-center justify-between max-xl:gap-x-4 xl:gap-6 py-4 last:pb-0"
          >
            <td
              class="font-normal"
              :title="label"
            >
              {{ label }}
            </td>

            <td
              class="text-grey-900 font-semibold"
              :title="value"
            >
              <div
                v-if="pending"
                class="w-20 h-6 bg-gray-200 rounded-md animate-pulse"
              />
              <span v-else>{{ value }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import RecurringBillsIcon from '~/assets/icons/icon-recurring-bills.svg';
import type { SummaryCardProps } from './summaryCard.type';
import { formatCurrency } from '~/utils';

const { summary, pending } = defineProps<SummaryCardProps>();

const safeSummary = computed(() => summary ?? {
  paidBills: 0,
  upcoming: 0,
  dueSoon: 0,
  totalBills: 0,
});

const billingDetails = computed(() => [
  { id: 1, label: 'Contas pagas', value: formatCurrency(safeSummary.value.paidBills, false) },
  { id: 3, label: 'A vencer em 5 dias', value: formatCurrency(safeSummary.value.dueSoon, false) },
  { id: 2, label: 'Próximos vencimentos', value: formatCurrency(safeSummary.value.upcoming, false) },
]);
</script>
