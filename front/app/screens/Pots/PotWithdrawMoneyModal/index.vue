<template>
  <Modal
    v-model="showModal"
    :title="`Retirar de ${pot?.name}`"
    intro="Retire dinheiro desta poupança. O valor será devolvido ao saldo principal e reduzirá o valor que você tem nesta poupança."
  >
    <form
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <div>
        <div class="flex justify-between items-center">
          <p class="text-sm text-grey-500 font-medium">Novo valor</p>
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
          label="Valor a retirar"
          name="withdrawAmount"
          :custom-classes="`w-full ${errors.withdrawAmount ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.withdrawAmount" />
      </div>

      <Button
        :is-submitting="isSubmitting"
        label="Retirar"
        data-testid="confirm-remove-money"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal, Progressbar, FormError, Input } from '#components';
import type { PotData } from '../pots.type';
import { usePotWithdrawMoneyModal } from './usePotWithdrawMoneyModal';
import { formatCurrency } from '~/utils';

const { modelValue, pot } = defineProps<{ modelValue: boolean, pot: PotData | null }>();
const emit = defineEmits(['update:modelValue', 'refresh-pots']);

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
} = usePotWithdrawMoneyModal(
  toRef(() => pot),
  () => {
    emit('refresh-pots');
    showModal.value = false;
  },
);

watch(showModal, (visible) => {
  if (visible) {
    reset();
  }
});
</script>
