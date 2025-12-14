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
import type { PotData } from '../pots.type';
import { useDeletePotModal } from './useDeletePotModal';

const { modelValue, pot } = defineProps<{ modelValue: boolean, pot: PotData | null }>();
const emit = defineEmits(['update:modelValue', 'refreshPots']);

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { isSubmitting, handleSubmit } = useDeletePotModal(
  toRef(() => pot),
  () => {
    emit('refreshPots');
    showModal.value = false;
  },
);
</script>
