<template>
  <div class="grid md:gap-6 bg-white rounded-xl max-md:p-4 md:p-10 w-full">
    <div class="flex justify-between items-center gap-4">
      <h3 class="max-sm:text-base text-xl font-bold text-grey-900">Contas Recorrentes</h3>

      <NuxtLink
        to="/contas-recorrentes"
        class="group text-grey-500 flex items-center gap-2 text-sm font-normal hover:text-grey-900 active:text-grey-300 duration-150 ease-in-out"
      >
        Ver todos
        <CaretDownIcon class="fill-grey-500 group-hover:fill-grey-900 group-active:fill-grey-300 -rotate-90 duration-150 ease-in-out" />
      </NuxtLink>
    </div>

    <div class="grid items-center gap-4">
      <div
        v-for="pot in (pots || [])"
        :key="pot.id"
        class="rounded-l-lg rounded-r-xl"
        :style="{ backgroundColor: pot.colorHex || '#ccc' }"
      >
        <div class="bg-beige-100 flex justify-between items-center gap-1 ml-1 px-4 py-6 h-full w-full rounded-lg">
          <p class="text-sm text-grey-500">{{ pot.name }}</p>
          <p class="text-sm text-grey-900 font-bold">{{ formatCurrency(pot.maximumSpend, false) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CaretDownIcon from '~/assets/icons/icon-caret-down.svg';
import { NuxtLink } from '#components';
import { useOverview } from '../useOverview';

const { recurringBills } = useOverview();

console.log('recurringBills: ', recurringBills.value);

const pots = [
  {
    id: '68e5679bde9ef6eb4d207be1',
    name: 'Contas pagas',
    maximumSpend: recurringBills?.value?.paidBills || 0,
    colorHex: '#277C78',
  },
  {
    id: '68e567bade9ef6eb4d207be2',
    name: 'A vencer em 5 dias',
    maximumSpend: recurringBills?.value?.dueSoon || 0,
    colorHex: '#82C9D7',
  },
  {
    id: '68e56820de9ef6eb4d207be3',
    maximumSpend: recurringBills?.value?.upcoming || 0,
    name: 'Próximos vencimentos',
    colorHex: '#F2CDAC',
  },
];
</script>
