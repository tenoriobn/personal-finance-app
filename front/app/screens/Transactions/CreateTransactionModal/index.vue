<template>
  <Modal
    v-model="showModal"
    title="Criar nova Transação"
    intro="Selecione uma categoria para vincular essa transação. Assim, você poderá monitorar seus gastos em Orçamentos."
  >
    <form
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <Input
        v-model="formState.name"
        :label="'Nome da Transação'"
        name="transactionName"
        custom-classes="w-full"
      />

      <InputDatePicker
        v-model="formState.date"
        label="Data da Transação"
        name="transactionDate"
        custom-classes="w-full"
        is-dark
        is-range
      />

      <Dropdown
        v-model="formState.budgetId"
        label="Categoria"
        :options="categories?.map(category => ({ name: category.name, id: category.budgetId })) || []"
        :start-empty="true"
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
          v-model="formState.recurring"
          type="checkbox"
          name="Recorrente"
          class="cursor-pointer w-4 h-4 rounded-lg"
        >

        <span class="cursor-pointer text-sm text-grey-900">Recorrente</span>
      </label>

      <Button label="Criar" />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, InputDatePicker, Modal } from '#components';
import { useApiGet, useApiPost } from '~/composables/api/useApiMethods';
import { useCurrencyMask } from '~/composables/useCurrencyMask';
import type { CreateTransactionModalProps, TransactionForm } from './createTransactionModal.type';

const { modelValue } = defineProps<CreateTransactionModalProps>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { data: categories } = useApiGet<{ id: string, name: string, budgetId: string }[]>('categories/used');
const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();

const formState = reactive<TransactionForm>({
  name: '',
  date: null as Date | null,
  amount: amount,
  recurring: false,
  budgetId: '',
  userId: '68cc2ec3f0818350607a26b6',
});

const resetForm = () => {
  Object.assign(formState, {
    name: '',
    date: null,
    amount: amount, // reusa o mesmo ref da máscara
    recurring: false,
    budgetId: '',
    userId: '68cc2ec3f0818350607a26b6',
  });

  amount.value = 0; // garante que o campo monetário visual zera
};

const handleSubmit = async () => {
  const data = await useApiPost('transactions', formState);

  // eslint-disable-next-line no-console
  console.log('Payload preparado:', data);

  resetForm();
  showModal.value = false;
};
</script>
