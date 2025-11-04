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

      <Button
        :disabled="!isFormValid || isSubmitting"
        label="Criar"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, InputDatePicker, Modal } from '#components';
import { useApiGet, useApiPost } from '~/composables/api/useApiMethods';
import { useCurrencyMask } from '~/composables/useCurrencyMask';
import type { CategoryData, CreateTransactionModalProps, TransactionForm } from './createTransactionModal.type';

const { modelValue } = defineProps<CreateTransactionModalProps>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { data: categories } = useApiGet<CategoryData[]>('categories/used');
const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();

const defaultForm: TransactionForm = {
  name: '',
  date: '',
  amount: amount.value,
  recurring: false,
  budgetId: '',
  userId: '68cc2ec3f0818350607a26b6',
};

const formState = reactive({ ...defaultForm });

const resetForm = () => {
  Object.assign(formState, { ...defaultForm });
  amount.value = 0;
};

const isFormValid = computed(() =>
  formState.name.trim()
  && formState.date
  && amount.value > 0
  && formState.budgetId.trim(),
);

const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const payload = { ...formState, amount: amount.value };
    const data = await useApiPost('transactions', payload);
    // eslint-disable-next-line no-console
    console.log('Payload preparado:', data);

    resetForm();
    showModal.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
