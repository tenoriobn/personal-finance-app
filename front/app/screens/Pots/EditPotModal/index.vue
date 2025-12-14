<template>
  <Modal
    v-model="showModal"
    title="Editar Pote"
    intro="Se seus objetivos de poupança mudarem, fique à vontade para atualizar seus valores."
  >
    <form
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-1">
        <Input
          v-model="formState.name"
          :label="'Nome do Pote'"
          name="potName"
          :custom-classes="`w-full ${errors.name ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
        />

        <FormError :message="errors.name" />
      </div>

      <div class="flex flex-col gap-1">
        <Input
          :model-value="formattedAmount"
          label="Valor da Meta"
          name="targetAmount"
          :custom-classes="`w-full ${errors.targetAmount ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.targetAmount" />
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
        label="Editar"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal, Dropdown, FormError, Input } from '#components';
import { useThemes } from '../useThemes';
import { useEditPotModal } from './useEditPotModal';
import type { PotData } from '../pots.type';

const { modelValue, pot } = defineProps<{
  modelValue: boolean
  pot: PotData | null
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'refreshPots'): void
}>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { themes, refreshThemes } = useThemes();

const {
  formState,
  errors,
  isSubmitting,
  formattedAmount,
  onInput,
  onKeyDown,
  onPaste,
  themeOptions,
  handleSubmit,
} = useEditPotModal(
  () => pot,
  () => themes.value ?? [],
  () => {
    emit('refreshPots');
    refreshThemes();
    showModal.value = false;
  },
);
</script>
