<template>
  <div class="bg-white rounded-xl max-md:p-4 md:p-[2rem]">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span class="block bg-green w-4 h-4 rounded-full" />
        <h3 class="text-xl font-bold text-grey-900">Entretenimento</h3>
      </div>

      <CardActionsMenu
        v-model:open="isOpenBudgetActions"
        delete-label="Deletar Orçamento"
        edit-label="Editar Orçamento"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <p class="text-sm text-grey-500 mt-6">Máximo de R$3.000,00</p>

    <Progressbar
      class="p-1"
      custom-classes="h-6"
    />
    <BalanceOverview />
    <LatestSpendingTable />
  </div>
</template>

<script setup lang="ts">
import LatestSpendingTable from './LatestSpendingTable/index.vue';
import { Progressbar, CardActionsMenu } from '#components';
import BalanceOverview from './BalanceOverview/index.vue';
import { ref } from 'vue';

const isOpenBudgetActions = ref(false);

const handleEdit = () => {
  // eslint-disable-next-line no-console
  console.log('Editar orçamento');
};

const handleDelete = () => {
  // eslint-disable-next-line no-console
  console.log('Deletar orçamento');
};
</script>
