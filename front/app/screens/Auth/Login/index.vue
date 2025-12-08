<template>
  <h2 class="text-grey-900 max-md:text-2xl md:text-[2rem] text-center font-bold leading-none">Acesse sua conta</h2>

  <form
    class="flex flex-col gap-6"
    @submit.prevent="handleSubmit"
  >
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
        type="password"
        :is-submitting="isSubmitting"
      />

      <FormError :message="errors.password" />
    </div>

    <Button
      :is-submitting="isSubmitting"
      label="Entrar"
    />

    <p class="text-base text-grey-500 text-center">
      Precisa criar uma conta?
      <NuxtLink
        class="font-semibold underline text-grey-900 hover:text-grey-500 active:text-grey-300 duration-150 ease-in-out"
        to="/cadastro"
      >Cadastre-se</NuxtLink>
    </p>
  </form>
</template>

<script lang="ts" setup>
import { Button, Input, NuxtLink } from '#components';
import { handleLoginApiErrors } from './handleLoginApiErrors';
import { baseLoginSchema } from './login.schema';
import type { LoginForm, LoginResponse } from './login.type';

const defaultForm: LoginForm = {
  email: '',
  password: '',
};

const formState = reactive({ ...defaultForm });

const errors = reactive<Record<string, string>>({
  email: '',
  password: '',
});

watch(() => formState.email, () => {
  errors.email = '';
});

watch(() => formState.password, () => {
  errors.password = '';
});

const validateAndSetErrors = (): boolean => {
  Object.keys(errors).forEach(k => (errors[k] = ''));

  const parsed = baseLoginSchema.safeParse(formState);

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
    const { token } = await useApiPost('auth/login', formState) as LoginResponse;
    const { setToken } = useAuth();
    setToken(token);

    await navigateTo('/');

    resetForm();
  }
  catch (err: unknown) {
    handleLoginApiErrors(err, errors, notify);
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
