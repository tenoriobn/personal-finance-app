<template>
  <RecurringBills />
</template>

<script lang="ts" setup>
import RecurringBills from '~/screens/RecurringBills/index.vue';

useHead({
  title: 'Contas Recorrentes',
  meta: [
    {
      name: 'description',
      content: 'Gerencie suas contas recorrentes acompanhando vencimentos, valores pagos, próximas faturas e contas a vencer. Busque, filtre e ordene transações recorrentes com totalização completa.',
    },
  ],
});
</script>
