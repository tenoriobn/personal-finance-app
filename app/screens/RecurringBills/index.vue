<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Contas Recorrentes" />
    </header>

    <div class="grid gap-4 xl:grid-cols-[minmax(310px,480px)_1fr]">
      <div class="xl:sticky xl:top-10 w-full h-max flex flex-col md:max-xl:flex-row gap-4">
        <div class="flex max-md:items-center md:flex-col md:justify-center gap-4 bg-grey-900 rounded-xl max-md:p-4 md:p-[2rem] w-full">
          <RecurringBillsIcon class="fill-grey-100" />

          <div>
            <h3 class="grid md:gap-2 text-grey-100 text-base font-bold">
              Total de contas
              <span class="text-3xl">R$ 250,00</span>
            </h3>
          </div>
        </div>

        <div class="bg-white rounded-xl max-md:p-4 md:p-[2rem] w-full">
          <h3 class="text-xl font-bold text-grey-900 justify-self-start">Resumo</h3>

          <table class="w-full">
            <tbody class="divide-y divide-grey-100 text-grey-500 text-sm">
              <tr
                v-for="{ id, label, value } in resume || []"
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
                  {{ value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid max-md:gap-6 md:gap-10 bg-white rounded-xl max-md:p-4 md:p-10 w-full">
        <Filter
          v-model:search="search"
          v-model:selected-category="selectedCategory"
          v-model:selected-sort="selectedSort"
        />

        <Table
          :transactions="transactions"
          :pending="pending"
        />

        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="goToPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TitleSection } from '#components';
import RecurringBillsIcon from '~/assets/icons/icon-recurring-bills.svg';

import Table from './Table/index.vue';
import Filter from './Filters/index.vue';
import Pagination from './Pagination/index.vue';
import { useTransactions } from './useTransactions';

const resume = [
  { id: 1, label: 'Contas pagas', value: 'R$ 105.000,00' },
  { id: 2, label: 'Total a pagar', value: 'R$ 105.000,00' },
  { id: 3, label: 'Próximo vencimento', value: 'R$ 105.000,00' },
];

const {
  transactions, search, selectedCategory, selectedSort, totalPages, currentPage, goToPage, pending,
} = useTransactions();
</script>
