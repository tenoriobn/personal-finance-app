<template>
  <Modal
    v-model="showModal"
    title="Deletar Poupança"
    intro="Tem certeza de que deseja excluir esta poupança? Esta ação é irreversível e todas as informações associadas a ela serão perdidas."
  >
    <Button
      :is-submitting="isSubmitting"
      label="Deletar Poupança"
      class="w-full bg-red text-white border-red opacity-75 hover:bg-red hover:text-white hover:border-red hover:opacity-80 active:bg-red active:text-white active:opacity-100 active:border-red shadow-none"
      @click="handleSubmit"
    />
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal } from '#components';
import { useApiDelete, useToast } from '~/composables';
import { useThemes } from '../useThemes';
import type { PotData } from '../pots.type';

const { modelValue, pot } = defineProps<{ modelValue: boolean, pot: PotData | null }>();
const emit = defineEmits(['update:modelValue', 'refreshPots']);
const { refreshThemes } = useThemes();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const isSubmitting = ref(false);
const { notify } = useToast();

const handleSubmit = async () => {
  if (isSubmitting.value || !pot) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useApiDelete(`pots/${pot.id}`);

    notify('error', 'Poupança deletada com sucesso!');
    emit('refreshPots');

    refreshThemes();

    showModal.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
