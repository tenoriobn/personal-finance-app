<template>
  <Modal
    v-model="showModal"
    :title="`Adicionar em ${pot?.name}`"
    intro="Adicione dinheiro ao seu pote para mantê-lo separado do saldo principal. O valor será descontado do seu saldo atual."
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
import { useApiPut, useCurrencyMask, useToast } from '~/composables';
import type { PotData } from '../pots.type';
import { calculatePercentUsed } from '~/utils/calculations';
import { formatCurrency } from '~/utils';

const { modelValue, pot } = defineProps<{ modelValue: boolean, pot: PotData | null }>();
const emit = defineEmits(['update:modelValue', 'refresh-pots']);

const showModal = computed({
  get: () => modelValue,
  set: val => emit('update:modelValue', val),
});

const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();

const errors = reactive({ totalAmount: '' });

const resetErrors = () => {
  errors.totalAmount = '';
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
  return (pot.totalAmount || 0) + amount.value;
});

const currentPercent = computed(() => {
  if (!pot) {
    return 0;
  }
  return calculatePercentUsed(currentTotal.value, pot.targetAmount);
});

const validate = () => {
  resetErrors();
  if (amount.value <= 0) {
    errors.totalAmount = 'O valor mínimo permitido é R$ 1,00.';
    return false;
  }

  const maxAdd = (pot?.targetAmount ?? 0) - (pot?.totalAmount ?? 0);

  if (amount.value > maxAdd) {
    errors.totalAmount = `Esse valor excede a meta do pote. Máximo disponível para adicionar: ${formatCurrency(maxAdd, false)}.`;
    return false;
  }

  return true;
};

const isSubmitting = ref(false);
const { notify } = useToast();

const handleSubmit = async () => {
  if (!pot) {
    return;
  }
  if (isSubmitting.value || !validate()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useApiPut(`pots/${pot.id}`, {
      totalAmount: pot.totalAmount + amount.value,
    });

    notify('success', 'Poupança atualizada com sucesso!');
    emit('refresh-pots');
    showModal.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
