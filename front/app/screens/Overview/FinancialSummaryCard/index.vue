<template>
  <section class="grid md:grid-cols-3 xl:grid-cols-3 max-md:gap-4 md:gap-6">
    <article
      v-for="(item, index) in summaryItems"
      :key="item.key"
      class="grid gap-1 rounded-xl max-md:p-4 md:p-[2rem] w-full"
      :class="index === 0 ? 'bg-grey-900' : 'bg-white'"
    >
      <h3
        class="text-base font-semibold"
        :class="index === 0 ? 'text-grey-200' : 'text-grey-500'"
      >
        {{ item.label }}
      </h3>

      <p
        v-if="pending"
        class="w-28 h-8 xl:w-36 xl:h-9 rounded animate-pulse bg-grey-200"
      />

      <p
        v-else
        class="text-2xl xl:text-3xl font-bold"
        :class="index === 0 ? 'text-white' : 'text-grey-900'"
      >
        {{ formatCurrency(item.value || 0, false) }}
      </p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils';
import { useOverview } from '../useOverview';

const { summaryTransactions, pending } = useOverview();

const summaryItems = computed(() => [
  {
    key: 'current-balance',
    label: 'Saldo Atual',
    value: summaryTransactions.value?.currentBalance,
  },
  {
    key: 'income',
    label: 'Entradas',
    value: summaryTransactions.value?.income,
  },
  {
    key: 'expenses',
    label: 'Saídas',
    value: summaryTransactions.value?.expenses,
  },
]);
</script>
