<template>
  <Register />
</template>

<script lang="ts" setup>
import Register from '~/screens/Auth/Register/index.vue';

definePageMeta({ layout: 'auth', public: true });

useHead({
  title: 'Cadastro',
  meta: [
    {
      name: 'description',
      content: 'Crie sua conta no Personal Finance App para começar a gerenciar suas finanças, criar orçamentos, acompanhar transações e poupanças de forma prática e segura.',
    },
  ],
});
</script>
