<template>
  <section class="grid grid-rows-1 xl:grid-cols-3 gap-4">
    <article
      v-for="(item, index) in summaryItems"
      :key="item.key"
      class="grid md:gap-2 rounded-xl max-md:p-4 md:p-[2rem] w-full"
      :class="index === 0 ? 'bg-grey-900' : 'bg-white'"
    >
      <h3
        class="text-base font-semibold"
        :class="index === 0 ? 'text-grey-200' : 'text-grey-500'"
      >
        {{ item.label }}
      </h3>

      <p
        class="text-2xl xl:text-3xl font-bold"
        :class="index === 0 ? 'text-white' : 'text-grey-900'"
      >
        {{ formatCurrency(item.value, false) }}
      </p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils';

const summaryItems = [
  {
    key: 'current-balance',
    label: 'Saldo Atual',
    value: 483600,
  },
  {
    key: 'income',
    label: 'Entradas',
    value: 381425,
  },
  {
    key: 'expenses',
    label: 'Saídas',
    value: 170050,
  },
];
</script>
