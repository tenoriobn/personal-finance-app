<template>
  <h2 class="text-grey-900 max-md:text-2xl md:text-[2rem] text-center font-bold leading-none">Acesse sua conta</h2>

  <button
    :class="[
      'flex items-center justify-center gap-2 font-semibold text-grey-900 duration-150 ease-in-out w-max self-center',
      demoIsSubmitting ? 'disabled:cursor-not-allowed opacity-75' : 'hover:text-grey-500 active:text-grey-300 ',
    ]"
    :disabled="demoIsSubmitting"
    @click="handleDemoLogin"
  >
    <LoadingIcon
      v-if="demoIsSubmitting"
      class="w-5"
    />
    Entrar como DEMO
  </button>

  <form
    class="flex flex-col gap-6"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-1">
      <Input
        v-model="formState.email"
        :label="'Email'"
        name="email"
        :is-submitting="isSubmitting || demoIsSubmitting"
      />

      <FormError :message="errors.email" />
    </div>

    <div class="flex flex-col gap-1">
      <Input
        v-model="formState.password"
        :label="'Senha'"
        name="senha"
        type="password"
        :is-submitting="isSubmitting || demoIsSubmitting"
      />

      <FormError :message="errors.password" />
    </div>

    <Button
      :is-submitting="isSubmitting || demoIsSubmitting"
      label="Entrar"
    />

    <p class="text-base text-grey-500 text-center">
      Precisa criar uma conta?
      <NuxtLink
        :class="[
          'font-semibold underline text-grey-900 duration-150 ease-in-out',
          isSubmitting || demoIsSubmitting ? 'cursor-not-allowed opacity-75' : ' hover:text-grey-500 active:text-grey-300 ',
        ]"
        to="/cadastro"
        :disabled="isSubmitting || demoIsSubmitting"
      >Cadastre-se</NuxtLink>
    </p>
  </form>
</template>

<script lang="ts" setup>
import { Button, Input, NuxtLink, FormError } from '#components';
import { handleApiErrors } from '~/utils';
import { baseLoginSchema } from './login.schema';
import type { LoginForm, LoginResponse } from './login.type';
import { useAuth, useToast, useApiPost, useDemoAuth } from '~/composables';
import LoadingIcon from '~/assets/icons/loading.svg';

const { loginDemoUser, isSubmitting: demoIsSubmitting } = useDemoAuth();

const handleDemoLogin = async () => {
  await loginDemoUser();
};

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
    const { token } = await useApiPost('auth/login', { ...formState }) as LoginResponse;
    const { setToken } = useAuth();
    setToken(token);

    await navigateTo('/');

    resetForm();
  }
  catch (err: unknown) {
    handleApiErrors(err, errors, notify, {
      password: ['Email ou senha incorretos'],
    });
  }
  finally {
    isSubmitting.value = false;
  }
};
</script>
