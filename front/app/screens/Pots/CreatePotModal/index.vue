<template>
  <Modal
    v-model="showModal"
    title="Criar nova Poupança"
    :intro="modalIntro"
    :intro-has-spacing="hasAvailableThemes"
  >
    <form
      v-if="hasAvailableThemes"
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-1">
        <Input
          v-model="formState.name"
          :label="'Nome da Poupança'"
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
          :options="themes?.map(theme => ({ name: theme.colorName, id: theme.id, colorHex: theme.colorHex })) || []"
          :start-empty="true"
          data-testid="theme-dropdown"
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
import { Button, Modal, Dropdown, FormError, Input } from '#components';
import { useThemes } from '../useThemes';
import { useCreatePotModal } from './useCreatePotModal';

const { modelValue } = defineProps<{ modelValue: boolean }>();

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
  hasAvailableThemes,
  modalIntro,
  handleSubmit,
} = useCreatePotModal(
  () => themes.value ?? [],
  () => {
    emit('refreshPots');
    refreshThemes();
    showModal.value = false;
  },
);
</script>
