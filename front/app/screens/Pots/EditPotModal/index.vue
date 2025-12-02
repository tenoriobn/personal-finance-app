<template>
  <Modal
    v-model="showModal"
    title="Criar novo Pote"
    intro="Se seus objetivos de poupança mudarem, fique à vontade para atualizar seus valores."
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
          :options="themeOptions"
          :start-empty="false"
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
import { Button, Modal } from '#components';
import { useApiPut, useCurrencyMask, useToast } from '~/composables';
import { useThemes } from '../useThemes';
import type { PotData, PotForm } from '../pots.type';
import { basePotSchema } from '../pot.schema';
import { handlePotApiErrors } from '../handlePotApiErrors';

const { modelValue, pot } = defineProps<{ modelValue: boolean, pot: PotData | null }>();
const emit = defineEmits(['update:modelValue', 'refreshPots']);

const showModal = computed({
  get: () => modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { formattedAmount, amount, onInput, onKeyDown, onPaste } = useCurrencyMask();

const formState = reactive<PotForm>({
  name: '',
  targetAmount: amount.value,
  totalAmount: 0,
  themeId: '',
  userId: '68cc2ec3f0818350607a26b6',
});

watch(() => pot, (newPot) => {
  if (!newPot) {
    return;
  }

  formState.name = newPot.name;
  amount.value = Number(newPot.targetAmount);
  formState.themeId = newPot.theme.id;
}, { immediate: true });

const { themes, refreshThemes } = useThemes();

const themeOptions = computed(() => {
  if (!themes.value) {
    return [];
  }

  const opts = themes.value.map(theme => ({
    id: theme.id,
    name: theme.colorName,
    colorHex: theme.colorHex,
  }));

  if (pot?.theme && !opts.some(option => option.id === pot.theme.id)) {
    opts.unshift({
      id: pot.theme.id,
      name: pot.theme.colorName,
      colorHex: pot.theme.colorHex,
    });
  }

  return opts;
});

const errors = reactive<Record<string, string>>({
  name: '',
  targetAmount: '',
  themeId: '',
});

function resetErrors() {
  Object.keys(errors).forEach(k => (errors[k] = ''));
}

function initFormFromPot() {
  if (!pot) {
    formState.name = '';
    amount.value = 0;
    formState.themeId = '';
    return;
  }

  formState.name = pot.name;
  amount.value = Number(pot.targetAmount);
  formState.themeId = pot.theme.id;
}

watch(
  () => showModal.value,
  (visible) => {
    if (visible) {
      resetErrors();
      initFormFromPot();
    }
  },
  { immediate: false },
);

const validateAndSetErrors = () => {
  const payload = {
    ...formState,
    targetAmount: amount.value,
  };

  resetErrors();

  const parsed = basePotSchema.safeParse(payload);
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
  if (!pot) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useApiPut(`pots/${pot.id}`, {
      name: formState.name,
      targetAmount: amount.value,
      themeId: formState.themeId,
    });

    notify('success', 'Poupança atualizado com sucesso!');
    emit('refreshPots');

    refreshThemes();

    showModal.value = false;
  }
  catch (err: unknown) {
    handlePotApiErrors(err, errors, notify);
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
