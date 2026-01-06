import { computed, reactive, ref, watch } from 'vue';
import { useApiPut, useCurrencyMask, useToast } from '~/composables';
import { basePotSchema } from '../pot.schema';
import type { PotData, PotForm, ThemeData } from '../pots.type';
import { handleApiErrors } from '~/utils';

export function useEditPotModal(pot: () => PotData | null, themes: () => ThemeData[], onSuccess?: () => void) {
  const { notify } = useToast();
  const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();

  const currentTotal = computed(() => {
    const current = pot();
    if (!current) {
      return 0;
    }

    return calculateSpent(current.totalAmount ?? []);
  });

  const formState = reactive<PotForm>({
    name: '',
    targetAmount: amount.value,
    totalAmount: 0,
    themeId: '',
  });

  const errors = reactive<Record<string, string>>({
    name: '',
    targetAmount: '',
    themeId: '',
  });

  const initFormFromPot = () => {
    const currentPot = pot();
    if (!currentPot) {
      formState.name = '';
      amount.value = 0;
      formState.themeId = '';
      return;
    }

    formState.name = currentPot.name;
    amount.value = Number(currentPot.targetAmount);
    formState.themeId = currentPot.theme.id;
  };

  watch(pot, initFormFromPot, { immediate: true });

  const themeOptions = computed(() => {
    const list = themes() ?? [];

    const opts = list.map(theme => ({
      id: theme.id,
      name: theme.colorName,
      colorHex: theme.colorHex,
    }));

    const currentPot = pot();
    if (
      currentPot?.theme
      && !opts.some(option => option.id === currentPot.theme.id)
    ) {
      opts.unshift({
        id: currentPot.theme.id,
        name: currentPot.theme.colorName,
        colorHex: currentPot.theme.colorHex,
      });
    }

    return opts;
  });

  watch(() => formState.name, () => (errors.name = ''));
  watch(amount, () => (errors.targetAmount = ''));
  watch(() => formState.themeId, () => (errors.themeId = ''));

  const resetErrors = () => {
    Object.keys(errors).forEach(k => (errors[k] = ''));
  };

  const validateAndSetErrors = (): boolean => {
    const payload = {
      ...formState,
      targetAmount: amount.value,
    };

    resetErrors();

    const parsed = basePotSchema.safeParse(payload);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? '');
        if (key in errors) {
          errors[key] = issue.message;
        }
      });
      return false;
    }

    const currentPot = currentTotal.value;
    const newMaximum = amount.value;

    if (newMaximum < currentPot) {
      errors.targetAmount = `Está poupança já economizou ${formatCurrency(currentPot, false)}. 
      O valor da meta não pode ser menor que isso.`;
      return false;
    }

    return true;
  };

  const isSubmitting = ref(false);

  const handleSubmit = async () => {
    const currentPot = pot();
    if (!currentPot || isSubmitting.value || !validateAndSetErrors()) {
      return;
    }

    isSubmitting.value = true;

    try {
      await useApiPut(`pots/${currentPot.id}`, {
        name: formState.name,
        targetAmount: amount.value,
        themeId: formState.themeId,
      });

      notify('success', 'Poupança atualizada com sucesso!');
      onSuccess?.();
    }
    catch (err: unknown) {
      handleApiErrors(err, errors, notify, {
        name: ['nome', 'Nome'],
        themeId: ['tema', 'Tema'],
      });
    }
    finally {
      isSubmitting.value = false;
    }
  };

  return {
    formState,
    errors,
    isSubmitting,
    resetErrors,

    formattedAmount,
    onInput,
    onKeyDown,
    onPaste,

    themeOptions,

    initFormFromPot,
    handleSubmit,
  };
}
