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
import { useApiDelete } from '~/composables/api/useApiMethods';
import { useToast } from '~/composables/useToast';
import type { DeleteBudgetModalProps } from './DeleteBudgetModal.type';
import { useCategoriesAndThemes } from '../useCategoriesAndThemes';

const { modelValue, budget } = defineProps<DeleteBudgetModalProps>();
const emit = defineEmits(['update:modelValue', 'refreshBudgets']);
const { refreshCategoriesAndThemes } = useCategoriesAndThemes();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const isSubmitting = ref(false);
const { notify } = useToast();

const handleSubmit = async () => {
  if (isSubmitting.value || !budget) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useApiDelete(`budgets/${budget.id}`);

    notify('error', 'Orçamento deletado com sucesso!');
    emit('refreshBudgets');

    // refreshCategories();
    // refreshThemes();

    refreshCategoriesAndThemes();

    showModal.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
