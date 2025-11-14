<template>
  <div
    v-for="{ id, category, theme, maximumSpend, transactions } in budgets || []"
    :key="id"
    class="bg-white rounded-xl max-md:p-4 md:p-[2rem]"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span
          class="block w-4 h-4 rounded-full"
          :style="{ backgroundColor: theme.colorHex }"
        />
        <h3 class="text-xl font-bold text-grey-900">{{ category.name }}</h3>
      </div>

      <!-- Aqui está a correção -->
      <CardActionsMenu
        :open="openMenuId === id"
        delete-label="Deletar Orçamento"
        edit-label="Editar Orçamento"
        @update:open="value => openMenuId = value ? id : null"
        @edit="handleEdit(id)"
        @delete="handleDelete(id)"
      />
    </div>

    <p class="text-sm text-grey-500 mt-6">
      Máximo de {{ formatCurrency(maximumSpend, false) }}
    </p>

    <Progressbar
      :color-hex="theme.colorHex"
      :percent="getPercent(transactions, maximumSpend) || 0"
    />

    <BalanceOverview
      :color-hex="theme.colorHex"
      :spent="getSpent(transactions)"
      :free="getFree(transactions, maximumSpend)"
    />

    <LatestSpendingTable
      :transactions="transactions"
      :category-id="category.id"
    />
  </div>
</template>

<script setup lang="ts">
import LatestSpendingTable from './LatestSpendingTable/index.vue';
import { Progressbar, CardActionsMenu } from '#components';
import BalanceOverview from './BalanceOverview/index.vue';
import { ref } from 'vue';
import { formatCurrency } from '~/utils';
import { getSpent, getFree, getPercent } from '~/utils/finance';
import { useBudgets } from '../useBudgets';

const emit = defineEmits<{ (e: 'edit-budget' | 'delete-budget', id: string): void }>();

const openMenuId = ref<string | null>(null);

const { budgets } = useBudgets();

const handleEdit = (id: string) => {
  emit('edit-budget', id);
};

const handleDelete = (id: string) => {
  emit('delete-budget', id);
};
</script>
