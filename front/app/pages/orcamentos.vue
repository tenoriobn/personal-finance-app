<template>
  <Budgets />
</template>

<script lang="ts" setup>
import Budgets from '~/screens/Budgets/index.vue';

useHead({
  title: 'Orçamentos',
  meta: [
    {
      name: 'description',
      content: 'Crie novos orçamentos, acompanhe o resumo de gastos, limite disponível e últimos gastos em um painel completo com gráficos e cards detalhados.',
    },
  ],
});
</script>
