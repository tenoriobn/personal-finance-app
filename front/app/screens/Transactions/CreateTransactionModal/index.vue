<template>
  <Modal
    v-model="showModal"
    title="Criar nova Transação"
    :intro="modalIntro"
    :intro-has-spacing="hasAvailableCategories"
  >
    <form
      v-if="hasAvailableCategories"
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-1">
        <Input
          v-model="formState.name"
          label="Nome da Transação"
          name="transactionName"
          :custom-classes="`w-full ${errors.name ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
        />
        <FormError :message="errors.name" />
      </div>

      <div class="flex flex-col gap-1">
        <InputDatePicker
          v-model="formState.date"
          label="Data da Transação"
          name="transactionDate"
          :custom-classes="`w-full ${errors.date ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
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
          :is-submitting="isSubmitting"
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
          :is-submitting="isSubmitting"
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.amount" />
      </div>

      <Dropdown
        v-model="formState.type"
        :is-submitting="isSubmitting"
        label="Tipo"
        :options="[
          { id: 'IN', name: 'Entrada' },
          { id: 'OUT', name: 'Saída' },
        ]"
      />

      <InputCheckbox
        id="recurring"
        v-model="formState.recurring"
        label="Recorrente"
        :is-submitting="isSubmitting"
      />

      <Button
        :is-submitting="isSubmitting"
        label="Criar"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, InputDatePicker, Modal, Dropdown, FormError, Input, InputCheckbox } from '#components';
import { useApiGet, useApiPost, useCurrencyMask, useToast } from '~/composables';
import { createTransactionSchema } from './transaction.schema';
import type { CategoryData, TransactionForm } from './createTransactionModal.type';
import type { BudgetData } from '~/screens/Budgets/budgets.type';
import { calculateSpent, calculateRemaining } from '~/utils/calculations';
import { formatCurrency } from '~/utils';

const { modelValue } = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'transactionCreated'): void
}>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { data: categories } = useApiGet<CategoryData[]>('categories/used');

const hasAvailableCategories = computed(() =>
  (categories.value?.length ?? 0) > 0,
);

const modalIntro = computed(() => {
  if (!hasAvailableCategories.value) {
    return `Para registrar uma transação, é necessário ter um orçamento criado. Crie um orçamento e vincule-o a uma categoria para começar a acompanhar seus gastos.
    `;
  }

  return 'Selecione uma categoria para vincular essa transação. Assim, você poderá monitorar seus gastos em Orçamentos.';
});

const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();

const defaultForm: TransactionForm = {
  name: '',
  date: '',
  amount: amount.value,
  recurring: false,
  budgetId: '',
  userId: '68cc2ec3f0818350607a26b6',
  type: 'IN',
};

const formState = reactive({ ...defaultForm });

const errors = reactive<Record<string, string>>({
  name: '',
  date: '',
  amount: '',
  budgetId: '',
});

watch(() => formState.name, () => (errors.name = ''));
watch(() => formState.date, () => (errors.date = ''));
watch(() => formState.budgetId, () => (errors.budgetId = ''));
watch(amount, () => (errors.amount = ''));

const buildPayload = () => ({
  ...formState,
  amount: formState.type === 'OUT'
    ? -Math.abs(amount.value)
    : Math.abs(amount.value),
});

const selectedBudget = ref<BudgetData | null>(null);

watch(() => formState.budgetId, async (id) => {
  errors.budgetId = '';
  selectedBudget.value = null;

  if (!id) {
    return;
  }

  const result = await useApiGet<BudgetData>(`budgets/${id}`, {}, false);

  if (result && !('data' in result)) {
    selectedBudget.value = result;
    return;
  }

  selectedBudget.value = result.data.value ?? null;
});

const validateAndSetErrors = (): boolean => {
  const payload = buildPayload();

  Object.keys(errors).forEach(k => (errors[k] = ''));

  const parsed = createTransactionSchema.safeParse(payload);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '');
      if (key in errors) {
        errors[key] = issue.message;
      }
    }
    return false;
  }

  if (!selectedBudget.value) {
    return true;
  }

  const { transactions = [], maximumSpend = 0 } = selectedBudget.value;

  const spent = calculateSpent(transactions);
  const free = calculateRemaining(transactions, maximumSpend);
  const value = payload.amount;

  if (value < 0) {
    if (spent <= 0) {
      errors.amount = 'Este orçamento não possui saldo para retirar.';
      return false;
    }

    const maxWithdraw = spent;

    if (Math.abs(value) > maxWithdraw) {
      errors.amount = `Saldo insuficiente. Máximo para retirar: ${formatCurrency(maxWithdraw, false)}`;
      return false;
    }
  }

  if (value > 0) {
    if (value > free) {
      errors.amount = `Este valor excede o limite do orçamento. Máximo disponível para adicionar: ${formatCurrency(free, false)}`;
      return false;
    }
  }

  return true;
};

const isSubmitting = ref(false);

const resetForm = () => {
  Object.assign(formState, { ...defaultForm });
  amount.value = 0;
  Object.keys(errors).forEach(k => (errors[k] = ''));
};

const { notify } = useToast();

const handleSubmit = async () => {
  if (isSubmitting.value || !validateAndSetErrors()) {
    return;
  };

  isSubmitting.value = true;

  try {
    const payload = buildPayload();
    await useApiPost('transactions', payload);

    emit('transactionCreated');
    notify('success', 'Transação criada com sucesso!');
    resetForm();
    showModal.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
