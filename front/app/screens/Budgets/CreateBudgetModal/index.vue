<template>
  <Modal
    v-model="showModal"
    title="Criar novo Orçamento"
    intro="Selecione uma categoria para definir um orçamento de gastos. Essas categorias podem ajudar você a monitorar seus gastos."
  >
    <form class="flex flex-col gap-6">
      <Input
        v-model="maximumSpend"
        :label="'Gasto máximo'"
        name="maximumSpend"
        custom-classes="w-full"
      />

      <Dropdown
        v-model="budgetSelectedCategory"
        :label="'Categoria'"
        :options="categories"
        data-testid="dropdown-sort-by"
        custom-classes="w-full max-md:h-[46px] md:h-[54px]"
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
import type { CreateBudgetModalProps } from './createBudgetModal.type';

const { modelValue } = defineProps<CreateBudgetModalProps>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const maximumSpend = ref('');
const budgetSelectedCategory = ref('');
const selectedTheme = ref('');

const categories = ['Todos', 'Entretenimento', 'Fundos', 'Alimentos', 'Jantar fora', 'Transporte'];
const themes = ['Azul', 'Verde', 'Rosa', 'Cinza', 'Amarelo', 'Branco'];
</script>
