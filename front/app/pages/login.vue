<template>
  <Login />
</template>

<script lang="ts" setup>
import Login from '~/screens/Auth/Login/index.vue';

definePageMeta({ layout: 'auth' });

useHead({
  title: 'Login',
  meta: [
    {
      name: 'description',
      content: 'Acesse sua conta no Personal Finance App de forma segura para gerenciar suas finanças, acompanhar transações, orçamentos e poupanças.',
    },
  ],
});
</script>
