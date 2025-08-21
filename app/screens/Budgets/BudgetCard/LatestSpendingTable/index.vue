<template>
  <div class="bg-beige-100 rounded-xl mt-6 p-4">
    <table class="w-full">
      <thead class="text-grey-500">
        <tr class="flex justify-between items-center gap-4 pb-2">
          <th
            scope="col"
            class="truncate text-sm font-normal"
          >
            <h3 class="max-sm:text-base text-xl font-bold text-grey-900">Últimos gastos</h3>
          </th>

          <th scope="col">
            <NuxtLink
              to="/transacoes"
              class="group flex items-center gap-2 text-sm font-normal hover:text-grey-900 active:text-grey-300 duration-150 ease-in-out"
            >
              Ver todos
              <CaretDownIcon class="fill-grey-500 group-hover:fill-grey-900 group-active:fill-grey-300 -rotate-90 duration-150 ease-in-out" />
            </NuxtLink>
          </th>
        </tr>
      </thead>

      <tbody class="divide-y text-grey-500 text-sm text-wrap">
        <tr
          v-for="spending in latestSpending"
          :key="spending.id"
          class="grid grid-cols-[1fr_auto] grid-rows-2 items-center max-sm:gap-2 sm:gap-x-4 py-4 last:pb-0"
        >
          <td class="row-span-2 flex items-center max-sm:gap-2 sm:gap-4 text-grey-900 font-bold">
            <img
              :src="spending.avatar"
              alt="Avatar"
              class="max-sm:w-8 max-sm:h-8 sm:w-10 sm:h-10 rounded-full"
            >
            <span class="truncate">
              {{ spending.nome }}
            </span>
          </td>

          <td class="col-start-3 row-start-2 text-right font-normal truncate">
            {{ spending.data }}
          </td>

          <td class="col-start-3 row-start-1 text-right font-bold truncate text-green">
            {{ spending.valor }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import CaretDownIcon from '~/assets/icons/icon-caret-down.svg';
import { NuxtLink } from '#components';

const latestSpending = [
  {
    id: 1,
    nome: 'Pixel Playground',
    avatar: '/images/avatars/pixel-playground.jpg',
    data: '11/08/2024',
    valor: 'R$10,00',
  },
  {
    id: 2,
    nome: 'Design Studio',
    avatar: '/images/avatars/pixel-playground.jpg',
    data: '12/08/2024',
    valor: 'R$25,00',
  },
  {
    id: 3,
    nome: 'Creative Lab',
    avatar: '/images/avatars/pixel-playground.jpg',
    data: '13/08/2024',
    valor: 'R$30,00',
  },
];
</script>
