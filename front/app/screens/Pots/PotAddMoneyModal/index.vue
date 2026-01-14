<template>
  <Modal
    v-model="showModal"
    :title="`Adicionar em ${pot?.name}`"
    intro="Adicione dinheiro na sua poupança para mantê-lo separado do saldo principal. O valor será descontado do seu saldo atual."
  >
    <form
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <div>
        <div class="flex justify-between items-center">
          <p class="text-sm text-grey-500 font-semibold">Novo valor</p>
          <p class="text-xl text-grey-900 font-bold">
            {{ formatCurrency(currentTotal, false) }}
          </p>
        </div>

        <Progressbar
          container-padding="p-0"
          bar-height="h-2"
          :color-hex="pot?.theme.colorHex"
          :percent="currentPercent"
        />

        <div class="flex justify-between items-center mt-4">
          <p class="text-sm text-green font-medium">
            {{ currentPercent.toFixed(2) }}%
          </p>

          <p class="text-sm text-grey-500 font-medium">
            Meta de {{ formatCurrency(pot?.targetAmount || 0, false) }}
          </p>
        </div>
      </div>

      <div class="flex flex-col mt-2 gap-1">
        <Input
          :model-value="formattedAmount"
          label="Valor Adicionado"
          name="totalAmount"
          :custom-classes="`w-full ${errors.totalAmount ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.totalAmount" />
      </div>

      <Button
        :is-submitting="isSubmitting"
        label="Adicionar"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal, Progressbar, FormError, Input } from '#components';
import type { PotData } from '../pots.type';
import { formatCurrency } from '~/utils';
import { usePotAddMoneyModal } from './usePotAddMoneyModal';

const { modelValue, pot } = defineProps<{ modelValue: boolean, pot: PotData | null }>();
const emit = defineEmits(['update:modelValue']);

const showModal = computed({
  get: () => modelValue,
  set: val => emit('update:modelValue', val),
});

const {
  formattedAmount,
  onInput,
  onKeyDown,
  onPaste,
  errors,
  isSubmitting,
  currentTotal,
  currentPercent,
  reset,
  handleSubmit,
} = usePotAddMoneyModal(
  toRef(() => pot),
  () => showModal.value = false,
);

watch(showModal, (visible) => {
  if (visible) {
    reset();
  }
});
</script>
