<template>
  <nav
    data-testid="pagination"
    aria-label="Pagination"
    class="flex items-center justify-center max-sm:gap-2 sm:gap-4"
  >
    <ul class="flex items-center max-sm:gap-2 sm:gap-4">
      <li>
        <button
          data-testid="prev-pagination"
          :disabled="currentPage < 1"
          class="flex items-center justify-center enabled:hover:bg-grey-100 enabled:active:bg-grey-200 border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out opacity-60 shadow-lg shadow-grey-500/20"
          :class="currentPage === 1 ? 'cursor-not-allowed' : ''"
          aria-label="Previous page"
          @click="emit('page-change', currentPage - 1)"
        >
          <CaretDownIcon
            :class="currentPage === 1 ? 'fill-grey-300' : 'fill-grey-900'"
          />
        </button>
      </li>

      <li
        v-for="page in pages"
        :key="page"
      >
        <AnimatePresence>
          <motion.button
            v-if="page > 0"
            class="flex items-center justify-center border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl transition-colors duration-150 ease-in-out shadow-lg shadow-grey-500/20"
            v-bind="growIn"
            :class="[
              page === currentPage
                ? 'bg-grey-900 border-grey-900 text-white'
                : 'enabled:hover:bg-grey-100 enabled:active:bg-grey-200 text-grey-900',
            ]"
            :initial="{ opacity: 1 }"
            :aria-current="page === currentPage ? 'page' : undefined"
            :aria-label="`Go to page ${page}`"
            @click="emit('page-change', page)"
          >
            {{ page }}
          </motion.button>
        </AnimatePresence>
      </li>

      <li>
        <button
          data-testid="next-pagination"
          :disabled="currentPage === totalPages"
          class="flex items-center justify-center enabled:hover:bg-grey-100 enabled:active:bg-grey-200 border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out opacity-60 -rotate-180 shadow-lg shadow-grey-500/20"
          :class="currentPage === totalPages ? 'cursor-not-allowed' : ''"
          aria-label="Next page"
          @click="emit('page-change', currentPage + 1)"
        >
          <CaretDownIcon
            :class="currentPage === totalPages ? 'fill-grey-300' : 'fill-grey-900'"
          />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v';
import { growIn } from '~/motion/transitions';
import CaretDownIcon from '~/assets/icons/icon-caret-left.svg';
import type { PaginationProps } from './pagination.type';
import { usePagination } from './usePagination';

const { currentPage, totalPages } = defineProps<PaginationProps>();

const emit = defineEmits<{ (e: 'page-change', page: number): void }>();

const pages = computed(() => usePagination(currentPage, totalPages));
</script>
