<template>
  <Modal
    v-model="showModal"
    title="Editar Orçamento"
    intro="Edite o limite de gastos e os detalhes do orçamento."
  >
    <form
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-1">
        <Input
          :model-value="formattedAmount"
          label="Gasto máximo"
          name="maximumSpend"
          :custom-classes="`w-full ${errors.maximumSpend ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.maximumSpend" />
      </div>

      <div class="flex flex-col gap-1">
        <Dropdown
          v-model="formState.categoryId"
          label="Categoria"
          :options="categoryOptions"
          :start-empty="false"
          custom-classes="w-full max-md:h-[46px] md:h-[54px]"
          :form-error="errors.categoryId"
          :is-submitting="isSubmitting"
        />
        <FormError :message="errors.categoryId" />
      </div>

      <div class="flex flex-col gap-1">
        <Dropdown
          v-model="formState.themeId"
          label="Tema"
          :options="themeOptions"
          :start-empty="false"
          custom-classes="w-full max-md:h-[46px] md:h-[54px]"
          :form-error="errors.themeId"
          :is-submitting="isSubmitting"
        />
        <FormError :message="errors.themeId" />
      </div>

      <Button
        :is-submitting="isSubmitting"
        label="Salvar alterações"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Modal, Button, Input, Dropdown, FormError } from '#components';
import { computed } from 'vue';
import { useEditBudgetModal } from './useEditBudgetModal';
import type { BudgetData } from '../budgets.type';

const { modelValue, budget } = defineProps<{
  modelValue: boolean
  budget: BudgetData | null
}>();

const emit = defineEmits(['update:modelValue']);

const showModal = computed({
  get: () => modelValue,
  set: v => emit('update:modelValue', v),
});

const {
  formState,
  errors,
  isSubmitting,
  formattedAmount,
  initFormFromBudget,
  resetErrors,
  onInput,
  onKeyDown,
  onPaste,
  categoryOptions,
  themeOptions,
  handleSubmit,
} = useEditBudgetModal(
  () => budget,
  () => showModal.value = false,
);

watch(showModal, (isOpen) => {
  if (!isOpen) {
    resetErrors();
    initFormFromBudget();
  }
});
</script>
