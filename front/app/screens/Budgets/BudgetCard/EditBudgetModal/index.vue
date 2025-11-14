<template>
  <Modal
    v-model="showModal"
    title="Editar Orçamento"
    intro="Edite o limite de gastos e os detalhes do orçamento."
  >
    <form
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-1">
        <Input
          :model-value="formattedAmount"
          label="Gasto máximo"
          name="maximumSpend"
          :custom-classes="`w-full ${errors.maximumSpend ? 'border-red' : ''}`"
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
          :options="categoryOptions"
          :start-empty="false"
          custom-classes="w-full max-md:h-[46px] md:h-[54px]"
          :form-error="errors.categoryId"
        />
        <FormError :message="errors.categoryId" />
      </div>

      <div class="flex flex-col gap-1">
        <Dropdown
          v-model="formState.themeId"
          label="Tema"
          :options="themeOptions"
          :start-empty="false"
          custom-classes="w-full max-md:h-[46px] md:h-[54px]"
          :form-error="errors.themeId"
        />
        <FormError :message="errors.themeId" />
      </div>

      <Button
        :is-submitting="isSubmitting"
        label="Salvar alterações"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal } from '#components';
import { useApiPut } from '~/composables/api/useApiMethods';
import { useCurrencyMask } from '~/composables/useCurrencyMask';
import { useToast } from '~/composables/useToast';
import { EditBudgetSchema } from './editBudget.schema';
import type { BudgetForm, EditBudgetModalProps } from './editBudgetModal.type';
import { useCategoriesAndThemes } from '../../useCategoriesAndThemes';

const { modelValue, budget } = defineProps<EditBudgetModalProps>();
const emit = defineEmits(['update:modelValue', 'refreshBudgets']);

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();

const formState = reactive<BudgetForm>({
  maximumSpend: 0,
  categoryId: '',
  themeId: '',
  userId: '68cc2ec3f0818350607a26b6',
});

watch(
  () => budget,
  (newBudget) => {
    if (!newBudget) {
      return;
    }
    amount.value = Number(newBudget.maximumSpend);
    formState.categoryId = newBudget.category.id;
    formState.themeId = newBudget.theme.id;
  },
  { immediate: true },
);

const { categories, themes, refreshCategoriesAndThemes } = useCategoriesAndThemes();

const categoryOptions = computed(() => {
  if (!categories.value) {
    return [];
  }

  const opts = categories.value.map(category => ({
    id: category.id,
    name: category.name,
  }));

  if (budget?.category && !opts.some(option => option.id === budget.category.id)) {
    opts.unshift({
      id: budget.category.id,
      name: budget.category.name,
    });
  }

  return opts;
});

const themeOptions = computed(() => {
  if (!themes.value) {
    return [];
  }

  const opts = themes.value.map(theme => ({
    id: theme.id,
    name: theme.colorName,
  }));

  if (budget?.theme && !opts.some(option => option.id === budget.theme.id)) {
    opts.unshift({
      id: budget.theme.id,
      name: budget.theme.colorName,
    });
  }

  return opts;
});

const errors = reactive<Record<string, string>>({
  maximumSpend: '',
  categoryId: '',
  themeId: '',
});

function resetErrors() {
  Object.keys(errors).forEach(k => (errors[k] = ''));
}

function initFormFromBudget() {
  if (!budget) {
    amount.value = 0;
    formState.categoryId = '';
    formState.themeId = '';
    return;
  }

  amount.value = Number(budget.maximumSpend);
  formState.categoryId = budget.category.id;
  formState.themeId = budget.theme.id;
}

watch(
  () => showModal.value,
  (visible) => {
    if (visible) {
      resetErrors();
      initFormFromBudget();
    }
  },
  { immediate: false },
);

const validateAndSetErrors = () => {
  const payload = {
    ...formState,
    maximumSpend: amount.value,
  };

  resetErrors();

  const parsed = EditBudgetSchema.safeParse(payload);
  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as string;
      if (errors[key] !== undefined) {
        errors[key] = issue.message;
      }
    });

    return false;
  }

  return true;
};

const isSubmitting = ref(false);
const { notify } = useToast();

const handleSubmit = async () => {
  if (isSubmitting.value || !validateAndSetErrors()) {
    return;
  }
  if (!budget) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useApiPut(`budgets/${budget.id}`, {
      maximumSpend: amount.value,
      categoryId: formState.categoryId,
      themeId: formState.themeId,
    });

    notify('success', 'Orçamento atualizado com sucesso!');
    emit('refreshBudgets');

    refreshCategoriesAndThemes();

    showModal.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
