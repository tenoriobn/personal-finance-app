<template>
  <Modal
    v-model="showModal"
    title="Criar novo Orçamento"
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
          :options="categories?.map(c => ({ id: c.id, name: c.name })) || []"
          :start-empty="true"
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
          :options="themes?.map(t => ({ id: t.id, name: t.colorName, colorHex: t.colorHex })) || []"
          :start-empty="true"
          custom-classes="w-full max-md:h-[46px] md:h-[54px]"
          :form-error="errors.themeId"
          :is-submitting="isSubmitting"
        />
        <FormError :message="errors.themeId" />
      </div>

      <Button
        :is-submitting="isSubmitting"
        label="Criar"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Modal, Button, Input, Dropdown, FormError } from '#components';
import { computed } from 'vue';
import { useCreateBudgetModal } from './useCreateBudgetModal';

const { modelValue } = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue', 'refreshBudgets']);

const showModal = computed({
  get: () => modelValue,
  set: v => emit('update:modelValue', v),
});

const {
  formState,
  errors,
  isSubmitting,
  categories,
  themes,
  formattedAmount,
  onInput,
  onKeyDown,
  onPaste,
  hasAvailableCategories,
  modalIntro,
  handleSubmit,
} = useCreateBudgetModal(() => {
  emit('refreshBudgets');
  showModal.value = false;
});
</script>
