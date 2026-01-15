import { useApiPut, useCurrencyMask, useToast, useRefreshAll } from '~/composables';
import { calculatePercentUsed } from '~/utils/calculations';
import { formatCurrency } from '~/utils';
import type { PotData } from '../pots.type';

export function usePotAddMoneyModal(pot: Ref<PotData | null>, showModal: () => void) {
  const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();
  const errors = reactive({ totalAmount: '' });
  const isSubmitting = ref(false);
  const { notify } = useToast();
  const { refreshAfterPot } = useRefreshAll();

  const reset = () => {
    errors.totalAmount = '';
    amount.value = 0;
  };

  const currentTotal = computed(() =>
    pot.value ? (pot.value.totalAmount || 0) + amount.value : 0,
  );

  const currentPercent = computed(() =>
    pot.value ? calculatePercentUsed(currentTotal.value, pot.value.targetAmount) : 0,
  );

  const validate = () => {
    errors.totalAmount = '';

    if (amount.value <= 0) {
      errors.totalAmount = 'O valor mínimo permitido é R$ 1,00.';
      return false;
    }

    const maxAdd = (pot.value?.targetAmount ?? 0) - (pot.value?.totalAmount ?? 0);
    if (amount.value > maxAdd) {
      errors.totalAmount
        = `Esse valor excede a meta da poupança. Máximo disponível: ${formatCurrency(maxAdd, false)}.`;
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
        totalAmount: pot.value.totalAmount + amount.value,
      });

      refreshAfterPot();

      notify('success', 'Poupança atualizada com sucesso!');
      showModal();
    }
    finally {
      isSubmitting.value = false;
    }
  };

  return {
    formattedAmount,
    amount,
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
