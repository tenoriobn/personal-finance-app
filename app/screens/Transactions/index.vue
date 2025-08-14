<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <h2 class="text-grey-900 text-[2rem] font-bold leading-none">Transações</h2>

    <div class="grid max-md:gap-6 md:gap-10 bg-white rounded-xl max-md:p-4 md:p-10 w-full">
      <Filter
        v-model:search="search"
        v-model:selected-category="selectedCategory"
        v-model:selected-sort="selectedSort"
      />

      <Table
        :transactions="paginatedTransactions"
      />

      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="goToPage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Table from './Table/index.vue';
import Filter from './Filters/index.vue';
import Pagination from './Pagination/index.vue';
import { useTransactions } from './useTransactions';

const {
  currentPage, totalPages, paginatedTransactions, goToPage, search, selectedCategory, selectedSort,
} = useTransactions();
</script>
