<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Orçamentos" />
      <Button
        label="+Novo Orçamento"
        @click="showCreateBudgetModal = true"
      />
    </header>

    <div
      class="grid grid-cols-1 gap-4 xl:max-2xl:grid-cols-[minmax(0,400px)_1fr] 2xl:grid-cols-[minmax(0,480px)_1fr]"
    >
      <SpendingChart />

      <div class="grid gap-4">
        <BudgetCard
          @edit-budget="openEdit"
          @delete-budget="openDelete"
        />
      </div>

      <CreateBudgetModal
        v-model="showCreateBudgetModal"
      />

      <EditBudgetModal
        v-model="showEditBudgetModal"
        :budget="budgetToEdit"
      />

      <DeleteBudgetModal
        v-model="showDeleteBudgetModal"
        :budget="budgetToDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, TitleSection } from '#components';
import SpendingChart from './SpendingChart/index.vue';
import BudgetCard from './BudgetCard/index.vue';
import CreateBudgetModal from './CreateBudgetModal/index.vue';
import EditBudgetModal from './EditBudgetModal/index.vue';
import DeleteBudgetModal from './DeleteBudgetModal/index.vue';
import { useBudgets } from './useBudgets';
import type { BudgetData } from './budgets.type';

const { budgets } = useBudgets();

const showCreateBudgetModal = ref(false);

const showEditBudgetModal = ref(false);
const budgetToEdit = ref<BudgetData | null>(null);
const openEdit = (id: string) => {
  budgetToEdit.value = budgets.value.find(budget => budget.id === id) || null;
  showEditBudgetModal.value = true;
};

const showDeleteBudgetModal = ref(false);
const budgetToDelete = ref<BudgetData | null>(null);
const openDelete = (id: string) => {
  budgetToDelete.value = budgets.value.find(budget => budget.id === id) || null;
  showDeleteBudgetModal.value = true;
};
</script>
