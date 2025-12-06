<template>
  <h2 class="text-grey-900 max-md:text-2xl md:text-[2rem] text-center font-bold leading-none">Acesse sua conta</h2>

  <form class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <Input
        v-model="email"
        :label="'Email'"
        name="email"
        type="email"
      />

      <!-- <FormError :message="errors.name" /> -->
    </div>

    <div class="flex flex-col gap-1">
      <Input
        v-model="password"
        :label="'Senha'"
        name="senha"
        type="password"
      />

      <!-- <FormError :message="errors.name" /> -->
    </div>

    <Button
      label="Entrar"
    />

    <p class="text-base text-grey-500 text-center">
      Precisa criar uma conta?
      <NuxtLink
        class="text-grey-900 font-semibold underline"
        to="/"
      >Cadastre-se</NuxtLink>
    </p>
  </form>
</template>

<script lang="ts" setup>
import { Button, Input, NuxtLink } from '#components';

const email = ref('');
const password = ref('');
</script>
