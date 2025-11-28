<template>
  <Modal
    v-model="showModal"
    :title="`Retirar de ${pot?.name}`"
    intro="Retire dinheiro deste pote. O valor será devolvido ao saldo principal e reduzirá o valor que você tem neste pote."
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
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.withdrawAmount" />
      </div>

      <Button
        :is-submitting="isSubmitting"
        label="Retirar"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal, Progressbar } from '#components';
import { useApiPut, useCurrencyMask, useToast } from '~/composables';
import type { PotData } from '../pots.type';

const { modelValue, pot } = defineProps<{ modelValue: boolean, pot: PotData | null }>();
const emit = defineEmits(['update:modelValue', 'refresh-pots']);

const showModal = computed({
  get: () => modelValue,
  set: val => emit('update:modelValue', val),
});

const { formattedAmount, amount, onInput, onKeyDown, onPaste }
  = useCurrencyMask();

const errors = reactive({ withdrawAmount: '' });

const resetErrors = () => {
  errors.withdrawAmount = '';
};

watch(() => showModal.value, (visible) => {
  if (visible) {
    resetErrors();
    amount.value = 0;
  }
});

const currentTotal = computed(() => {
  if (!pot) {
    return 0;
  }
  return (pot.totalAmount || 0) - amount.value;
});

const currentPercent = computed(() => {
  if (!pot) {
    return 0;
  }
  return getPercent(currentTotal.value, pot.targetAmount);
});

const validate = () => {
  resetErrors();

  if (amount.value <= 0) {
    errors.withdrawAmount = 'O valor mínimo permitido é R$ 1,00.';
    return false;
  }

  const maxWithdraw = pot?.totalAmount ?? 0;

  if (amount.value > maxWithdraw) {
    errors.withdrawAmount = `Valor excede o saldo do pote. Máximo disponível para retirar: ${formatCurrency(maxWithdraw, false)}.`;
    return false;
  }

  return true;
};

const isSubmitting = ref(false);
const { notify } = useToast();

const handleSubmit = async () => {
  if (!pot || isSubmitting.value || !validate()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useApiPut(`pots/${pot.id}`, {
      totalAmount: pot.totalAmount - amount.value,
    });

    notify('success', 'Valor retirado com sucesso!');
    emit('refresh-pots');
    showModal.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
