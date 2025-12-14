import { useApiDelete, useToast } from '~/composables';
import { useThemes } from '../useThemes';
import type { PotData } from '../pots.type';

export function useDeletePotModal(pot: Ref<PotData | null>, onSuccess: () => void) {
  const isSubmitting = ref(false);
  const { notify } = useToast();
  const { refreshThemes } = useThemes();

  const handleSubmit = async () => {
    if (isSubmitting.value || !pot.value) {
      return;
    }

    isSubmitting.value = true;

    try {
      await useApiDelete(`pots/${pot.value.id}`);

      notify('error', 'Poupança deletada com sucesso!');
      refreshThemes();
      onSuccess();
    }
    finally {
      isSubmitting.value = false;
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
