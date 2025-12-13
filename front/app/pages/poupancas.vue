<template>
  <Pots />
</template>

<script lang="ts" setup>
import Pots from '~/screens/Pots/index.vue';

useHead({
  title: 'Poupanças',
  meta: [
    {
      name: 'description',
      content: 'Crie e gerencie suas poupanças definindo metas, acompanhando o valor economizado e visualizando o progresso com porcentagem e barra de evolução.',
    },
  ],
});
</script>
