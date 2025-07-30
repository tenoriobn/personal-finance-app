<template>
  <div class="grid max-md:gap-8 md:gap-10">
    <h2 class="text-grey-900 text-[2rem] font-bold leading-none">Transactions</h2>

    <div class="bg-white rounded-xl h-full max-md:p-4 md:p-10 w-full overflow-hidden">
      <div class="flex justify-between mb-10">
        <input
          id="search"
          class="text-grey-500 text-sm font-normal border border-grey-500 rounded-xl placeholder-grey-500 p-4 w-full max-w-[520px]"
          type="text"
          name="search"
          placeholder="Search transaction"
        >

        <!-- <div class="flex gap-6">
          <label class="flex items-center gap-4">
            Sort by
            <select
              id="sort"
              name="sort"
              class="text-sm text-grey-500 font-normal border border-grey-500 p-4 rounded-xl placeholder-grey-500 min-w-[136px]"
            >
              <option>Latest</option>
            </select>
          </label>

          <label class="flex items-center gap-4">
            Category
            <select
              id="category"
              name="category"
              class="text-sm text-grey-500 font-normal border border-grey-500 p-4 rounded-xl placeholder-grey-500 min-w-[188px]"
            >
              <option>All Transactions</option>
            </select>
          </label>
        </div> -->
      </div>

      <div class="w-full rounded-xl overflow-x-auto">
        <table class="w-full divide-y divide-gray-100">
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
          <tbody class="divide-y divide-gray-100 text-grey-500 text-sm text-nowrap">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import data from '@/data/data.json';

const { transactions } = data;

const tableHeaders = [
  { id: 1, title: 'Recipient/Sender' },
  { id: 2, title: 'Category' },
  { id: 3, title: 'Transaction Date' },
  { id: 4, title: 'Amount', align: 'text-right' },
];
</script>
