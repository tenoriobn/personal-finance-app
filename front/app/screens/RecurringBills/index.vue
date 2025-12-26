<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10 h-full">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Contas Recorrentes" />
    </header>

    <div class="grid gap-4 xl:grid-cols-[minmax(306px,480px)_1fr]">
      <SummaryCard
        :summary="summary"
        :pending="pending"
      />

      <div class="grid grid-rows-[auto_1fr] max-md:gap-6 md:gap-10 bg-white rounded-xl max-md:p-4 md:p-10 w-full h-max shadow-lg shadow-grey-500/20">
        <Filter
          v-model:search="search"
          v-model:selected-sort="selectedSort"
        />

        <Table
          :recurring-bills="bills"
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
import SummaryCard from './SummaryCard/index.vue';
import Table from './Table/index.vue';
import Filter from './Filters/index.vue';
import Pagination from '~/components/Pagination/index.vue';
import { useRecurringBills } from './useRecurringBills';

const { bills, totalPages, currentPage, goToPage, pending, search, selectedSort, summary } = useRecurringBills();
</script>
