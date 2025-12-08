<template>
  <div class="grid gap-6 bg-white rounded-xl max-md:p-4 md:p-10 w-full">
    <div class="flex justify-between items-center gap-4">
      <h3 class="max-sm:text-base sm:text-xl font-bold text-grey-900">Poupanças</h3>

      <NuxtLink
        to="/poupancas"
        class="group text-grey-500 flex items-center gap-2 text-sm font-normal hover:text-grey-900 active:text-grey-300 duration-150 ease-in-out"
      >
        Ver todos
        <CaretDownIcon class="fill-grey-500 group-hover:fill-grey-900 group-active:fill-grey-300 -rotate-90 duration-150 ease-in-out" />
      </NuxtLink>
    </div>

    <div class="grid md:grid-cols-[auto_auto] gap-6">
      <div class="grid grid-cols-[auto_1fr] items-center gap-4 bg-beige-100 rounded-xl max-md:p-4 md:p-[2rem] w-full">
        <PotIcon />

        <div class="grid gap-1">
          <h3 class="text-base text-grey-500 font-semibold">
            Total economizado
          </h3>
          <span
            class="text-2xl xl:text-3xl text-grey-900 font-bold"
          >{{ formatCurrency(summaryPots?.totalPotsAmount || 0, false) }}</span>
        </div>
      </div>

      <div
        class="grid grid-cols-2 items-center gap-x-2 gap-y-4"
      >
        <div
          v-for="pot in (summaryPots?.pots || [])"
          :key="pot.id"
          class="relative row-span-2 pl-4 flex items-center max-sm:gap-2 sm:gap-4"
        >
          <span
            class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg"
            :style="{ backgroundColor: pot.theme.colorHex || '#ccc' }"
          />

          <div class="grid gap-1">
            <p class="text-sm text-grey-500">{{ pot.name }}</p>
            <p class="text-sm text-grey-900 font-bold">{{ formatCurrency(pot?.totalAmount || 0, false) }}</p>
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
import { useOverview } from '../useOverview';

const { summaryPots } = useOverview();
</script>
