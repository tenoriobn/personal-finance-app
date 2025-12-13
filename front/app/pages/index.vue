<template>
  <Overview />
</template>

<script lang="ts" setup>
import Overview from '~/screens/Overview/index.vue';

useHead({
  title: 'Visão Geral',
  meta: [
    {
      name: 'description',
      content: 'Acompanhe seu saldo, transações, orçamentos e contas recorrentes em um único painel financeiro.',
    },
  ],
});
</script>
