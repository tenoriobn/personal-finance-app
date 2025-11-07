<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Transações" />

      <Button
        label="+Nova Transação"
        @click="showCreateTransactionModal = true"
      />
    </header>

    <div class="grid max-md:gap-6 md:gap-10 bg-white rounded-xl max-md:p-4 md:p-10 w-full">
      <Filter
        v-model:search="search"
        v-model:selected-category="selectedCategory"
        v-model:selected-sort="selectedSort"
      />

      <Table
        :transactions="transactions || []"
        :pending="pending"
      />

      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="goToPage"
      />

      <CreateTransactionModal
        v-model="showCreateTransactionModal"
        @transaction-created="refreshTransactions"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button, TitleSection } from '#components';
import Table from './Table/index.vue';
import Filter from './Filters/index.vue';
import Pagination from '~/components/Pagination/index.vue';
import { useTransactions } from '~/composables/useTransactions';
import CreateTransactionModal from './CreateTransactionModal/index.vue';

const {
  transactions, search, selectedCategory, selectedSort, totalPages, currentPage, goToPage, pending, refresh,
} = useTransactions('transactions');

const showCreateTransactionModal = ref(false);
const refreshTransactions = async () => {
  await refresh();
};
</script>
