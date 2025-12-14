<template>
  <Modal
    v-model="showModal"
    title="Criar novo Orçamento"
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
          :model-value="formattedAmount"
          label="Gasto máximo"
          name="maximumSpend"
          :custom-classes="`w-full ${errors.maximumSpend ? 'border-red' : ''}`"
          :is-submitting="isSubmitting"
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.maximumSpend" />
      </div>

      <div class="flex flex-col gap-1">
        <Dropdown
          v-model="formState.categoryId"
          label="Categoria"
          :options="categories?.map(category => ({ name: category.name, id: category.id })) || []"
          :start-empty="true"
          custom-classes="w-full max-md:h-[46px] md:h-[54px]"
          :form-error="errors.categoryId"
          :is-submitting="isSubmitting"
        />
        <FormError :message="errors.categoryId" />
      </div>

      <div class="flex flex-col gap-1">
        <Dropdown
          v-model="formState.themeId"
          label="Tema"
          :options="themes?.map(theme => ({ name: theme.colorName, id: theme.id, colorHex: theme.colorHex })) || []"
          :start-empty="true"
          data-testid="dropdown-sort-by"
          custom-classes="w-full max-md:h-[46px] md:h-[54px]"
          :form-error="errors.themeId"
          :is-submitting="isSubmitting"
        />
        <FormError :message="errors.themeId" />
      </div>

      <Button
        :is-submitting="isSubmitting"
        label="Criar"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal, Dropdown, FormError, Input } from '#components';
import { useApiPost, useCurrencyMask, useToast } from '~/composables';
import { useCategoriesAndThemes } from '../useCategoriesAndThemes';
import type { BudgetForm } from '../budgets.type';
import { baseBudgetSchema } from '../budget.schema';

const { modelValue } = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'refreshBudgets'): void
}>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();
const { categories, themes, refreshCategoriesAndThemes } = useCategoriesAndThemes();

const hasAvailableCategories = computed(() =>
  (categories.value?.length ?? 0) > 0,
);

const modalIntro = computed(() => {
  if (!hasAvailableCategories.value) {
    return `Você já criou orçamentos para todas as categorias disponíveis.
      Para criar um novo orçamento, exclua um orçamento que não esteja mais em uso e reaproveite a categoria correspondente.
    `;
  }

  return 'Ao criar um orçamento e estabelecer um limite de gastos, você poderá acompanhar melhor como utiliza seu dinheiro.';
});

const defaultForm: BudgetForm = {
  maximumSpend: amount.value,
  categoryId: '',
  themeId: '',
  userId: '68cc2ec3f0818350607a26b6',
};

const formState = reactive({ ...defaultForm });

const errors = reactive<Record<string, string>>({
  maximumSpend: '',
  categoryId: '',
  themeId: '',
});

watch(amount, () => {
  errors.maximumSpend = '';
});

watch(() => formState.categoryId, () => {
  errors.categoryId = '';
});

watch(() => formState.themeId, () => {
  errors.themeId = '';
});

const validateAndSetErrors = (): boolean => {
  const payload = { ...formState, maximumSpend: amount.value };

  Object.keys(errors).forEach(k => (errors[k] = ''));

  const parsed = baseBudgetSchema.safeParse(payload);

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

const { notify } = useToast();

const handleSubmit = async () => {
  if (isSubmitting.value || !validateAndSetErrors()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useApiPost('budgets', { ...formState, maximumSpend: amount.value });
    emit('refreshBudgets');
    refreshCategoriesAndThemes();
    notify('success', 'Orçamento criado com sucesso!');
    showModal.value = false;
    resetForm();
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
