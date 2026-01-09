import { computed, reactive, ref, watch } from 'vue';
import { useApiPost, useCurrencyMask, useToast } from '~/composables';
import { basePotSchema } from '../pot.schema';
import type { PotForm, ThemeData } from '../pots.type';
import { handleApiErrors } from '~/utils';

export function useCreatePotModal(themes: () => ThemeData[], onSuccess?: () => void) {
  const { notify } = useToast();
  const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();

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

  const hasAvailableThemes = computed(() => (themes().length ?? 0) > 0);

  const modalIntro = computed(() => {
    if (!hasAvailableThemes.value) {
      return `Você já criou poupanças com todos os temas disponíveis.
        Para criar uma nova poupança, exclua uma poupança que não esteja mais em uso e reaproveite o tema correspondente.
      `;
    }

    return 'Selecione um tema para definir uma poupança de economia. Essas poupanças podem ajudar você a monitorar seus gastos e reservas.';
  });

  watch(() => formState.name, () => (errors.name = ''));
  watch(amount, () => (errors.targetAmount = ''));
  watch(() => formState.themeId, () => (errors.themeId = ''));

  const validateAndSetErrors = (): boolean => {
    const payload = {
      ...formState,
      targetAmount: amount.value,
    };

    Object.keys(errors).forEach(k => (errors[k] = ''));

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

    return true;
  };

  const isSubmitting = ref(false);

  const resetForm = () => {
    Object.assign(formState, {
      name: '',
      targetAmount: amount.value,
      totalAmount: 0,
      themeId: '',
    });

    amount.value = 0;
    Object.keys(errors).forEach(k => (errors[k] = ''));
  };

  const handleSubmit = async () => {
    if (isSubmitting.value || !validateAndSetErrors()) {
      return;
    }

    isSubmitting.value = true;

    try {
      await useApiPost('pots', {
        ...formState,
        targetAmount: amount.value,
      });

      notify('success', 'Poupança criada com sucesso!');
      resetForm();
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

    formattedAmount,
    onInput,
    onKeyDown,
    onPaste,

    hasAvailableThemes,
    modalIntro,

    handleSubmit,
  };
}
