<template>
  <div
    v-for="{ id, name, totalAmount, targetAmount, theme } in pots || []"
    :key="id"
    class="bg-white rounded-xl max-md:p-4 md:p-[2rem]"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span
          class="block w-4 h-4 rounded-full"
          :style="{ backgroundColor: theme.colorHex }"
        />
        <h3 class="text-xl font-bold text-grey-900">{{ name }}</h3>
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
      <p class="text-2xl text-grey-900 font-bold">{{ formatCurrency(totalAmount, false) }}</p>
    </div>

    <Progressbar
      container-padding="p-0"
      bar-height="h-2"
      :color-hex="theme.colorHex"
      :percent="getPercent(totalAmount, targetAmount)"
    />

    <div class="flex justify-between items-center mt-2">
      <p class="text-xs text-grey-500 font-medium">
        {{ getPercent(totalAmount, targetAmount).toFixed(2) }}%
      </p>
      <p class="text-xs text-grey-500 font-medium">
        Meta de {{ formatCurrency(targetAmount, false) }}
      </p>
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
import { usePots } from '../usePots';
import { formatCurrency } from '~/utils';

const isOpenBudgetActions = ref(false);

const { pots } = usePots();

const handleEdit = () => {
  // eslint-disable-next-line no-console
  console.log('Editar Fundo');
};

const handleDelete = () => {
  // eslint-disable-next-line no-console
  console.log('Deletar Fundo');
};
</script>
