<template>
  <Modal
    v-model="showModal"
    title="Criar nova Transação"
    intro="Selecione uma categoria para vincular essa transação. Assim, você poderá monitorar seus gastos em Orçamentos."
  >
    <form class="flex flex-col gap-6">
      <Input
        v-model="transactionName"
        :label="'Nome da Transação'"
        name="transactionName"
        custom-classes="w-full"
      />

      <Input
        v-model="transactionDate"
        :label="'Data da Transação'"
        type="date"
        name="transactionData"
        custom-classes="w-full"
      />

      <Dropdown
        v-model="transactionCategory"
        :label="'Categoria'"
        :options="categories"
        data-testid="dropdown-sort-by"
        custom-classes="w-full max-md:h-[46px] md:h-[54px]"
      />

      <Input
        :model-value="formattedAmount"
        label="Valor"
        name="amount"
        custom-classes="w-full"
        @update:model-value="onInput"
        @keydown="onKeyDown"
        @paste="onPaste"
      />

      <label
        for="recurring"
        class="flex items-center gap-2 w-max h-4"
      >
        <input
          id="recurring"
          type="checkbox"
          name="Recorrente"
          class="cursor-pointer w-4 h-4 rounded-lg"
          value=""
        >

        <span class="cursor-pointer text-sm text-grey-900">Recorrente</span>
      </label>

      <Button label="Criar" />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal } from '#components';
import type { CreateTransactionModalProps } from './createTransactionModal.type';
import { useCurrencyMask } from '~/composables/useCurrencyMask';

const { modelValue } = defineProps<CreateTransactionModalProps>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const transactionName = ref('');
const transactionDate = ref('');
const transactionCategory = ref('');
const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();

watch(formattedAmount, (val) => {
  // eslint-disable-next-line no-console
  console.log('formattedAmount.value: ', val);
}, { immediate: true });

watch(amount, (val) => {
  // eslint-disable-next-line no-console
  console.log('amount.value: ', val);
}, { immediate: true });

const categories = ['Todos', 'Entretenimento', 'Fundos', 'Alimentos', 'Jantar fora', 'Transporte'];
</script>
