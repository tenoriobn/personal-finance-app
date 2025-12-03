<template>
  <div class="grid md:gap-6 bg-white rounded-xl max-md:p-4 md:p-10 w-full">
    <div class="flex justify-between items-center gap-4">
      <h3 class="max-sm:text-base text-xl font-bold text-grey-900">Poupanças</h3>

      <NuxtLink
        to="/poupancas"
        class="group text-grey-500 flex items-center gap-2 text-sm font-normal hover:text-grey-900 active:text-grey-300 duration-150 ease-in-out"
      >
        Ver todos
        <CaretDownIcon class="fill-grey-500 group-hover:fill-grey-900 group-active:fill-grey-300 -rotate-90 duration-150 ease-in-out" />
      </NuxtLink>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex items-center gap-4 bg-beige-100 rounded-xl max-md:p-4 md:p-[2rem] w-full">
        <PotIcon />

        <div class="grid md:gap-2">
          <h3 class="text-base text-grey-500 font-semibold">
            Total economizado
          </h3>
          <span
            class="text-2xl xl:text-3xl text-grey-900 font-bold"
          >{{ formatCurrency(850, false) }}</span>
        </div>
      </div>

      <div
        class="grid grid-cols-2 items-center max-sm:gap-2 sm:gap-x-4"
      >
        <div
          v-for="pot in (pots || []).slice(0, 4)"
          :key="pot.id"
          class="relative row-span-2 pl-4 flex items-center max-sm:gap-2 sm:gap-4"
        >
          <span
            class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg"
            :style="{ backgroundColor: pot.theme.colorHex || '#ccc' }"
          />

          <div class="grid gap-1">
            <p class="text-sm text-grey-500">{{ pot.category.name }}</p>
            <p class="text-sm text-grey-900 font-bold">{{ formatCurrency(159, false) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CaretDownIcon from '~/assets/icons/icon-caret-down.svg';
import PotIcon from '~/assets/icons/icon-pot.svg';
import { NuxtLink } from '#components';

const pots = [
  {
    id: '68e5679bde9ef6eb4d207be1',
    maximumSpend: 50,
    userId: '68cc2ec3f0818350607a26b6',
    category: {
      id: '68e56101e6616ee788ea45ae',
      name: 'Entretenimento',
    },
    theme: {
      id: '68e55f6be6616ee788ea45a0',
      colorName: 'Verde',
      colorHex: '#277C78',
    },
    transactions: [
      {
        id: '692f03ffa92189a2ee95f33c',
        name: 'Alex Poatan',
        date: '2025-12-08T03:00:00.000Z',
        amount: 250,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e5679bde9ef6eb4d207be1',
      },
      {
        id: '692ef8856b090fa57c8ad88b',
        name: 'Bruno Tenorio',
        date: '2025-12-04T03:00:00.000Z',
        amount: 150,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e5679bde9ef6eb4d207be1',
      },
      {
        id: '692f0462a92189a2ee95f33d',
        name: 'Alex Poatan',
        date: '2025-12-01T03:00:00.000Z',
        amount: 250,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e5679bde9ef6eb4d207be1',
      },
    ],
  },
  {
    id: '68e567bade9ef6eb4d207be2',
    maximumSpend: 750,
    userId: '68cc2ec3f0818350607a26b6',
    category: {
      id: '68e5610fe6616ee788ea45af',
      name: 'Contas',
    },
    theme: {
      id: '68e55f7ce6616ee788ea45a2',
      colorName: 'Ciano',
      colorHex: '#82C9D7',
    },
    transactions: [
      {
        id: '692f03d9a92189a2ee95f33b',
        name: 'Alexandre de Morais',
        date: '2025-12-05T03:00:00.000Z',
        amount: 10,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e567bade9ef6eb4d207be2',
      },
      {
        id: '690e39beabc6fde79cc4b306',
        name: 'Bruno Tenorio',
        date: '2025-11-07T03:00:00.000Z',
        amount: 999.99,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e567bade9ef6eb4d207be2',
      },
      {
        id: '690bb6b477759cff253870fb',
        name: 'Bruno Tenorio',
        date: '2025-11-05T03:00:00.000Z',
        amount: 23.12,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e567bade9ef6eb4d207be2',
      },
    ],
  },
  {
    id: '68e56820de9ef6eb4d207be3',
    maximumSpend: 75,
    userId: '68cc2ec3f0818350607a26b6',
    category: {
      id: '68e56125e6616ee788ea45b1',
      name: 'Jantar Fora',
    },
    theme: {
      id: '68e55f75e6616ee788ea45a1',
      colorName: 'Amarelo',
      colorHex: '#F2CDAC',
    },
    transactions: [
      {
        id: '690e39e7abc6fde79cc4b307',
        name: 'Bruno Tenorio Test',
        date: '2025-11-07T03:00:00.000Z',
        amount: 10,
        recurring: false,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e56820de9ef6eb4d207be3',
      },
      {
        id: '690a5e2c5d8294166866da15',
        name: 'Bruno Tenorio',
        date: '2025-11-04T03:00:00.000Z',
        amount: 9150,
        recurring: false,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e56820de9ef6eb4d207be3',
      },
      {
        id: '69090abce78014aeed3ea7e9',
        name: 'Bruno Tenorio',
        date: '2025-11-03T03:00:00.000Z',
        amount: 150,
        recurring: false,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e56820de9ef6eb4d207be3',
      },
    ],
  },
  {
    id: '68e56886de9ef6eb4d207be4',
    maximumSpend: 100,
    userId: '68cc2ec3f0818350607a26b6',
    category: {
      id: '68e56130e6616ee788ea45b3',
      name: 'Cuidados Pessoais',
    },
    theme: {
      id: '68e55f90e6616ee788ea45a3',
      colorName: 'Azul Marinho',
      colorHex: '#626070',
    },
    transactions: [
      {
        id: '69090b33e78014aeed3ea7ea',
        name: 'Bruno Tenorio',
        date: '2025-11-03T03:00:00.000Z',
        amount: 450000,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e56886de9ef6eb4d207be4',
      },
      {
        id: '68ed587ef8c20d40e863732b',
        name: 'Serenity Spa & Wellness',
        date: '2024-08-03T14:00:37.000Z',
        amount: 30,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e56886de9ef6eb4d207be4',
      },
      {
        id: '68ed57bb86dad9ca62c4bed8',
        name: 'Serenity Spa & Wellness',
        date: '2024-08-03T14:00:37.000Z',
        amount: 30,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68e56886de9ef6eb4d207be4',
      },
    ],
  },
  {
    id: '68efd9dbdf0e0dac482364bb',
    maximumSpend: 100,
    userId: '68cc2ec3f0818350607a26b6',
    category: {
      id: '68e5612be6616ee788ea45b2',
      name: 'Transporte',
    },
    theme: {
      id: '68e55f9ae6616ee788ea45a4',
      colorName: 'Vermelho',
      colorHex: '#C94736',
    },
    transactions: [
      {
        id: '6909105bd169367f6a6cfa10',
        name: 'Bruno Tenorio',
        date: '2025-11-03T03:00:00.000Z',
        amount: 905,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68efd9dbdf0e0dac482364bb',
      },
      {
        id: '69090e4fd169367f6a6cfa0f',
        name: 'Bruno Tenorio',
        date: '2025-11-03T03:00:00.000Z',
        amount: 900,
        recurring: true,
        userId: '68cc2ec3f0818350607a26b6',
        budgetId: '68efd9dbdf0e0dac482364bb',
      },
    ],
  },
  {
    id: '691796f9fdd4c0eab3ef37dc',
    maximumSpend: 100,
    userId: '68cc2ec3f0818350607a26b6',
    category: {
      id: '68e5611ae6616ee788ea45b0',
      name: 'Supermercado',
    },
    theme: {
      id: '68e55fa2e6616ee788ea45a5',
      colorName: 'Roxo',
      colorHex: '#826CB0',
    },
    transactions: [],
  },
  {
    id: '6929f590bd8ae38b0ab85ba0',
    maximumSpend: 50,
    userId: '68cc2ec3f0818350607a26b6',
    category: {
      id: '68e56137e6616ee788ea45b4',
      name: 'Educação',
    },
    theme: {
      id: '68e55fade6616ee788ea45a6',
      colorName: 'Turquesa',
      colorHex: '#597C7C',
    },
    transactions: [],
  },
];
</script>
