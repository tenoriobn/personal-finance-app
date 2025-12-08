<template>
  <h2 class="text-grey-900 max-md:text-2xl md:text-[2rem] text-center font-bold leading-none">Crie sua conta</h2>

  <form
    class="flex flex-col gap-6"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-1">
      <Input
        v-model="formState.name"
        :label="'Nome'"
        name="nome"
        :is-submitting="isSubmitting"
      />

      <FormError :message="errors.name" />
    </div>

    <div class="flex flex-col gap-1">
      <Input
        v-model="formState.email"
        :label="'Email'"
        name="email"
        :is-submitting="isSubmitting"
      />

      <FormError :message="errors.email" />
    </div>

    <div class="flex flex-col gap-1">
      <Input
        v-model="formState.password"
        :label="'Senha'"
        name="senha"
        :type="'password'"
        :is-submitting="isSubmitting"
      />

      <FormError :message="errors.password" />
    </div>

    <div class="flex flex-col gap-1">
      <Input
        v-model="formState.confirmPassword"
        :label="'Confirmar Senha'"
        name="confirmPassword"
        type="password"
      />

      <FormError :message="errors.confirmPassword" />
    </div>

    <Button
      :is-submitting="isSubmitting"
      label="Cadastrar"
    />

    <p class="text-base text-grey-500 text-center">
      Já tem uma conta?
      <NuxtLink
        class="font-semibold underline text-grey-900 hover:text-grey-500 active:text-grey-300 duration-150 ease-in-out"
        to="/login"
      >Entrar</NuxtLink>
    </p>
  </form>
</template>

<script lang="ts" setup>
import { Button, Input, NuxtLink } from '#components';
import { handleRegisterApiErrors } from './handleRegisterApiErrors';
import { baseRegisterSchema } from './register.schema';
import type { RegisterForm, RegisterResponse } from './register.type';

const defaultForm: RegisterForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const formState = reactive({ ...defaultForm });

const errors = reactive<Record<string, string>>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

watch(() => formState.name, () => {
  errors.name = '';
});

watch(() => formState.email, () => {
  errors.email = '';
});

watch(() => formState.password, () => {
  errors.password = '';
});

watch(() => formState.confirmPassword, () => {
  errors.confirmPassword = '';
});

const validateAndSetErrors = (): boolean => {
  Object.keys(errors).forEach(k => (errors[k] = ''));

  const parsed = baseRegisterSchema.safeParse(formState);

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
    const { token } = await useApiPost('auth/register', formState) as RegisterResponse;
    const { setToken } = useAuth();
    setToken(token);
    await navigateTo('/');

    resetForm();
  }
  catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(err, errors, notify);
    handleRegisterApiErrors(err, errors, notify);
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
