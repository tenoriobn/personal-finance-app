<template>
  <div class="bg-white rounded-xl max-md:p-4 md:p-[2rem]">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span class="block bg-green w-4 h-4 rounded-full" />
        <h3 class="text-xl font-bold text-grey-900">Dia do churrasco</h3>
      </div>

      <CardActionsMenu
        v-model:open="isOpenBudgetActions"
        delete-label="Deletar Fundo"
        edit-label="Editar Fundo"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <div class="flex justify-between items-center mt-6">
      <p class="text-sm text-grey-500 font-semibold">Total Economizado</p>
      <p class="text-2xl text-grey-900 font-bold">R$2.500,00</p>
    </div>

    <Progressbar custom-classes="h-2" />

    <div class="flex justify-between items-center mt-2">
      <p class="text-xs text-grey-500 font-medium">50.00%</p>
      <p class="text-xs text-grey-500 font-medium">Meta de R$5.000</p>
    </div>

    <div class="flex max-sm:flex-col gap-4 mt-6">
      <Button
        class="w-full"
        label="+Add Dinheiro"
      />

      <Button
        class="w-full"
        label="Retirar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Progressbar, CardActionsMenu } from '#components';
import { ref } from 'vue';

const isOpenBudgetActions = ref(false);

const handleEdit = () => {
  // eslint-disable-next-line no-console
  console.log('Editar Fundo');
};

const handleDelete = () => {
  // eslint-disable-next-line no-console
  console.log('Deletar Fundo');
};
</script>
