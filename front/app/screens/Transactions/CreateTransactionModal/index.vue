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
      <div class="flex flex-col gap-1">
        <Input
          v-model="formState.name"
          label="Nome da Transação"
          name="transactionName"
          :custom-classes="`w-full ${errors.name ? 'border-red' : ''}`"
        />
        <FormError :message="errors.name" />
      </div>

      <div class="flex flex-col gap-1">
        <InputDatePicker
          v-model="formState.date"
          label="Data da Transação"
          name="transactionDate"
          :custom-classes="`w-full ${errors.date ? 'border-red' : ''}`"
          is-dark
          is-range
        />
        <FormError :message="errors.date" />
      </div>

      <div class="flex flex-col gap-1">
        <Dropdown
          v-model="formState.budgetId"
          label="Categoria"
          :options="categories?.map(category => ({ name: category.name, id: category.budgetId })) || []"
          :start-empty="true"
          custom-classes="w-full max-md:h-[46px] md:h-[54px]"
          :form-error="errors.budgetId"
        />
        <FormError :message="errors.budgetId" />
      </div>

      <div class="flex flex-col gap-1">
        <Input
          :model-value="formattedAmount"
          label="Valor"
          name="amount"
          :custom-classes="`w-full ${errors.amount ? 'border-red' : ''}`"
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.amount" />
      </div>

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
        :disabled=" isSubmitting"
        label="Criar"
        class="disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-grey-900 disabled:hover:border-grey-900 disabled:hover:text-grey-200 disabled:active:bg-grey-900 disabled:active:border-grey-900 disabled:active:text-grey-200 disabled:shadow-none"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, InputDatePicker, Modal } from '#components';
import { useApiGet, useApiPost } from '~/composables/api/useApiMethods';
import { useCurrencyMask } from '~/composables/useCurrencyMask';
import { createTransactionSchema } from './transaction.schema';
import type { CategoryData, CreateTransactionModalProps, TransactionForm } from './createTransactionModal.type';
import FormError from '~/components/FormError/index.vue';

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

const errors = reactive<Record<string, string>>({
  name: '',
  date: '',
  amount: '',
  budgetId: '',
});

watch(() => formState.name, () => {
  errors.name = '';
});
watch(() => formState.date, () => {
  errors.date = '';
});
watch(() => formState.budgetId, () => {
  errors.budgetId = '';
});
watch(amount, () => {
  errors.amount = '';
});

const validateAndSetErrors = (): boolean => {
  const payload = { ...formState, amount: amount.value };

  Object.keys(errors).forEach(k => (errors[k] = ''));

  const parsed = createTransactionSchema.safeParse(payload);

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '');
      if (key && Object.prototype.hasOwnProperty.call(errors, key)) {
        errors[key] = issue.message;
      }
    }
    return false;
  }

  return true;
};

const isSubmitting = ref(false);

const resetForm = () => {
  Object.assign(formState, { ...defaultForm });
  amount.value = 0;
  Object.keys(errors).forEach(k => (errors[k] = ''));
};

const handleSubmit = async () => {
  if (isSubmitting.value || !validateAndSetErrors()) {
    return;
  }

  isSubmitting.value = true;
  try {
    await useApiPost('transactions', { ...formState, amount: amount.value });
    resetForm();
    showModal.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
