<template>
  <Modal
    v-model="showModal"
    title="Deletar Orçamento"
    intro="Tem certeza que deseja deletar este orçamento? Esta ação não pode ser desfeita e todas as transações associadas a ele serão perdidas."
  >
    <Button
      :is-submitting="isSubmitting"
      label="Deletar Orçamento"
      class="w-full bg-red text-white border-red opacity-75 hover:bg-red hover:text-white hover:border-red hover:opacity-80 active:bg-red active:text-white active:opacity-100 active:border-red shadow-none"
      @click="handleSubmit"
    />
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal } from '#components';
import type { BudgetData } from '../budgets.type';
import { useDeleteBudgetModal } from './useDeleteBudgetModal';

const { modelValue, budget } = defineProps<{ modelValue: boolean, budget: BudgetData | null }>();
const emit = defineEmits(['update:modelValue', 'refreshBudgets']);

const showModal = computed({
  get: () => modelValue,
  set: val => emit('update:modelValue', val),
});

const { isSubmitting, handleSubmit } = useDeleteBudgetModal(
  toRef(() => budget),
  () => {
    emit('refreshBudgets');
    showModal.value = false;
  },
);
</script>
