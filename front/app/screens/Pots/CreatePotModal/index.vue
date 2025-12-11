<template>
  <Modal
    v-model="showModal"
    title="Criar novo Pote"
    intro="Selecione um tema para definir um pote de economia. Esses potes podem ajudar você a monitorar seus gastos e reservas."
  >
    <form
      class="flex flex-col gap-6"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-1">
        <Input
          v-model="formState.name"
          :label="'Nome do Pote'"
          name="potName"
          :custom-classes="`w-full ${errors.name ? 'border-red' : ''}`"
        />

        <FormError :message="errors.name" />
      </div>

      <div class="flex flex-col gap-1">
        <Input
          :model-value="formattedAmount"
          label="Valor da Meta"
          name="targetAmount"
          :custom-classes="`w-full ${errors.targetAmount ? 'border-red' : ''}`"
          @update:model-value="onInput"
          @keydown="onKeyDown"
          @paste="onPaste"
        />
        <FormError :message="errors.targetAmount" />
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
import { useThemes } from '../useThemes';
import type { PotForm } from '../pots.type';
import { basePotSchema } from '../pot.schema';
import { handlePotApiErrors } from '../handlePotApiErrors';

const { modelValue } = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'refreshPots'): void
}>();

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();
const { themes, refreshThemes } = useThemes();

const defaultForm: PotForm = {
  name: '',
  targetAmount: amount.value,
  totalAmount: 0,
  themeId: '',
  userId: '68cc2ec3f0818350607a26b6',
};

const formState = reactive({ ...defaultForm });

const errors = reactive<Record<string, string>>({
  name: '',
  targetAmount: '',
  themeId: '',
});

watch(() => formState.name, () => {
  errors.name = '';
});

watch(amount, () => {
  errors.targetAmount = '';
});

watch(() => formState.themeId, () => {
  errors.themeId = '';
});

const validateAndSetErrors = (): boolean => {
  const payload = { ...formState, targetAmount: amount.value };

  Object.keys(errors).forEach(k => (errors[k] = ''));

  const parsed = basePotSchema.safeParse(payload);

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
  Object.assign(formState, defaultForm);
  amount.value = 0;

  for (const key in errors) {
    errors[key] = '';
  }
};

const { notify } = useToast();

const handleSubmit = async () => {
  if (isSubmitting.value || !validateAndSetErrors()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useApiPost('pots', { ...formState, targetAmount: amount.value });
    emit('refreshPots');
    refreshThemes();
    notify('success', 'Poupança criado com sucesso!');
    showModal.value = false;
    resetForm();
  }
  catch (err: unknown) {
    handlePotApiErrors(err, errors, notify);
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
