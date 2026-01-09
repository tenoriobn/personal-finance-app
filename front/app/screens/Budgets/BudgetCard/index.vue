<template>
  <BudgetCardSkeleton v-if="pending" />

  <div
    v-else-if="budgets.length === 0"
    class="grid place-items-center text-center text-grey-500 text-sm max-xl:py-6"
  >
    Nenhum orçamento encontrado. <br>
    Crie um novo orçamento para começar a gerenciar seus gastos!
  </div>

  <div
    v-for="{ id, category, theme, maximumSpend, transactions } in budgets || []"
    v-else
    :key="id"
    class="bg-white rounded-xl max-md:p-4 md:p-[2rem] shadow-lg shadow-grey-500/20"
    data-testid="budget-card"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span
          class="block w-4 h-4 rounded-full"
          :style="{ backgroundColor: theme.colorHex }"
        />
        <h3 class="text-xl font-bold text-grey-900">{{ category.name }}</h3>
      </div>

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
      :percent="calculatePercentUsed(transactions, maximumSpend) || 0"
    />

    <BalanceOverview
      :color-hex="theme.colorHex"
      :spent="calculateSpent(transactions)"
      :free="calculateRemaining(transactions, maximumSpend)"
    />

    <LatestSpendingTable
      :transactions="transactions.slice(0, 3)"
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
import { calculateSpent, calculateRemaining, calculatePercentUsed } from '~/utils/calculations';
import { useBudgets } from '../useBudgets';
import BudgetCardSkeleton from './BudgetCardSkeleton.vue';

const emit = defineEmits<{ (e: 'edit-budget' | 'delete-budget', id: string): void }>();

const openMenuId = ref<string | null>(null);

const { budgets, pending } = useBudgets();

const handleEdit = (id: string) => {
  emit('edit-budget', id);
};

const handleDelete = (id: string) => {
  emit('delete-budget', id);
};
</script>
