<template>
  <div class="flex items-center justify-center max-sm:gap-2 sm:gap-4">
    <button
      :disabled="currentPage === 1"
      class="flex items-center justify-center enabled:hover:bg-grey-100 enabled:active:bg-grey-200 border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out opacity-60 "
      @click="emit('page-change', currentPage - 1)"
    >
      <CaretDownIcon
        :class="currentPage === 1 ? 'fill-grey-300' : 'fill-grey-900'"
      />
    </button>

    <template
      v-for="page in pages"
      :key="page"
    >
      <button
        v-if="page > 0"
        :class="[
          'flex items-center justify-center border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out',
          page === currentPage
            ? 'bg-grey-900 border-grey-900 text-white'
            : 'enabled:hover:bg-grey-100 enabled:active:bg-grey-200 text-grey-900',
        ]"
        @click="emit('page-change', page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      :disabled="currentPage === totalPages"
      class="flex items-center justify-center enabled:hover:bg-grey-100 enabled:active:bg-grey-200 border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out opacity-60 -rotate-180"
      @click="emit('page-change', currentPage + 1)"
    >
      <CaretDownIcon
        :class="currentPage === totalPages ? 'fill-grey-300' : 'fill-grey-900'"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import CaretDownIcon from '~/assets/icons/icon-caret-left.svg';
import type { PaginationProps } from './pagination.type';
import { getPagesToShow } from './getPagesToShow';

const { currentPage, totalPages } = defineProps<PaginationProps>();
const emit = defineEmits<{ (e: 'page-change', page: number): void }>();

const pages = computed(() => getPagesToShow(currentPage, totalPages));
</script>
