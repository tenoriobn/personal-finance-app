<template>
  <Modal
    v-model="showModal"
    title="Criar novo Pote"
    intro="Selecione uma categoria para definir um pote de economia. Esses potes podem ajudar você a monitorar suas economias."
  >
    <form class="flex flex-col gap-6">
      <Input
        v-model="potName"
        :label="'Nome do Pote'"
        name="potName"
        custom-classes="w-full"
      />

      <Input
        v-model="goalValue"
        :label="'Valor da Meta'"
        name="goalValue"
        custom-classes="w-full"
      />

      <Dropdown
        v-model="selectedTheme"
        :label="'Tema'"
        :options="themes"
        data-testid="dropdown-sort-by"
        custom-classes="max-md:h-[46px] md:h-[54px]"
      />

      <Button label="Criar" />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal } from '#components';
import type { CreatePotModalProps } from './createPotModal.type';

const { modelValue } = defineProps<CreatePotModalProps>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const potName = ref('');
const goalValue = ref('');
const selectedTheme = ref('');

const themes = ['Azul', 'Verde', 'Rosa', 'Cinza', 'Amarelo', 'Branco'];
</script>
