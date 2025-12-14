import { useApiPut, useCurrencyMask, useToast } from '~/composables';
import { calculatePercentUsed } from '~/utils/calculations';
import { formatCurrency } from '~/utils';
import type { PotData } from '../pots.type';

export function usePotWithdrawMoneyModal(pot: Ref<PotData | null>, onSuccess: () => void) {
  const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();
  const errors = reactive({ withdrawAmount: '' });
  const isSubmitting = ref(false);
  const { notify } = useToast();

  const reset = () => {
    errors.withdrawAmount = '';
    amount.value = 0;
  };

  const currentTotal = computed(() => {
    if (!pot.value) {
      return 0;
    }
    return (pot.value.totalAmount || 0) - amount.value;
  });

  const currentPercent = computed(() => {
    if (!pot.value) {
      return 0;
    }
    return calculatePercentUsed(currentTotal.value, pot.value.targetAmount);
  });

  const validate = () => {
    errors.withdrawAmount = '';

    if (amount.value <= 0) {
      errors.withdrawAmount = 'O valor mínimo permitido é R$ 1,00.';
      return false;
    }

    const maxWithdraw = pot.value?.totalAmount ?? 0;

    if (amount.value > maxWithdraw) {
      errors.withdrawAmount
        = `Valor excede o saldo do pote. Máximo disponível para retirar: ${formatCurrency(maxWithdraw, false)}.`;
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!pot.value || isSubmitting.value || !validate()) {
      return;
    }

    isSubmitting.value = true;

    try {
      await useApiPut(`pots/${pot.value.id}`, {
        totalAmount: pot.value.totalAmount - amount.value,
      });

      notify('success', 'Valor retirado com sucesso!');
      onSuccess();
    }
    finally {
      isSubmitting.value = false;
    }
  };

  return {
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
  };
}
