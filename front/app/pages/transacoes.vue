<template>
  <Transactions />
</template>

<script lang="ts" setup>
import Transactions from '~/screens/Transactions/index.vue';

useHead({
  title: 'Transações',
  meta: [
    {
      name: 'description',
      content: 'Crie, busque e visualize suas transações financeiras, filtrando por orçamento, categoria ou ordenação.',
    },
  ],
});
</script>
