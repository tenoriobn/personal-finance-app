<template>
  <Modal
    v-model="showModal"
    title="Criar nova Transação"
    :intro="modalIntro"
    :intro-has-spacing="hasAvailableCategories"
  >
    <form
      v-if="hasAvailableCategories"
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-1">
        <Input
          v-model="formState.name"
          label="Nome da Transação"
          name="transactionName"
          :custom-classes="`w-full ${errors.name ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
        />
        <FormError :message="errors.name" />
      </div>

      <div class="flex flex-col gap-1">
        <InputDatePicker
          v-model="formState.date"
          label="Data da Transação"
          name="transactionDate"
          :custom-classes="`w-full ${errors.date ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
          is-dark
          is-range
        />
        <FormError :message="errors.date" />
      </div>

      <div class="flex flex-col gap-1">
        <Dropdown
          v-model="formState.budgetId"
          label="Categoria"
          :options="categoryOptions"
          :start-empty="true"
          :is-submitting="isSubmitting"
          custom-classes="w-full max-md:h-[46px] md:h-[54px]"
          :form-error="errors.budgetId"
        />
        <FormError :message="errors.budgetId" />
      </div>

      <div class="flex flex-col gap-1">
        <Input
          :model-value="formattedAmount"
          label="Valor"
          name="amount"
          :custom-classes="`w-full ${errors.amount ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.amount" />
      </div>

      <Dropdown
        v-model="formState.type"
        :is-submitting="isSubmitting"
        label="Tipo"
        :options="[
          { id: 'IN', name: 'Entrada' },
          { id: 'OUT', name: 'Saída' },
        ]"
      />

      <InputCheckbox
        id="recurring"
        v-model="formState.recurring"
        label="Recorrente"
        :is-submitting="isSubmitting"
      />

      <Button
        :is-submitting="isSubmitting"
        label="Criar"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import {
  Modal,
  Button,
  InputDatePicker,
  Dropdown,
  FormError,
  Input,
  InputCheckbox,
} from '#components';

import { useApiGet } from '~/composables';
import { useCreateTransactionModal } from './useCreateTransactionModal';
import type { CategoryData } from './createTransactionModal.type';

const { modelValue } = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'transactionCreated'): void
}>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { data: categories } = useApiGet<CategoryData[]>('categories/used');

const {
  formState,
  errors,
  isSubmitting,
  formattedAmount,
  onInput,
  onKeyDown,
  onPaste,
  hasAvailableCategories,
  modalIntro,
  categoryOptions,
  handleSubmit,
} = useCreateTransactionModal(
  () => categories.value ?? [],
  () => {
    emit('transactionCreated');
    showModal.value = false;
  },
);
</script>
