<template>
  <div
    ref="dropdownWrapper"
    class="relative grid"
  >
    <button
      class="opacity-50 hover:opacity-100 duration-150 ease-in-out relative"
      @click="toggleBudgetActions"
    >
      <DotsIcon />
    </button>

    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        class="absolute bg-white border border-grey-200 right-0 mt-6 z-10 rounded-xl shadow-md overflow-hidden w-max max-w-[156px]"
        v-bind="fadeSlideY"
      >
        <ul
          class="max-h-[212px] overflow-y-auto scroll-hide relative"
        >
          <button
            class="text-grey-900 hover:text-grey-500 active:text-grey-300 text-sm font-medium p-4 cursor-pointer duration-150 ease-in-out border-b border-grey-100 last:border-b-0 w-full"
            @click="editBudget"
          >
            Editar orçamento
          </button>

          <button
            class="text-red hover:text-red/85 active:text-red/55 text-sm font-medium p-4 cursor-pointer duration-150 ease-in-out border-b border-grey-100 last:border-b-0 w-full"
            @click="deleteBudget"
          >
            Deletar orçamento
          </button>
        </ul>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script lang="ts" setup>
import DotsIcon from '~/assets/icons/icon-dots.svg';
import { motion, AnimatePresence } from 'motion-v';
import { fadeSlideY } from '~/motion/transitions';
import { useClickOutside } from '~/composables/useClickOutside';
import { ref } from 'vue';

const emit = defineEmits<{ (e: 'edit' | 'delete'): void }>();

const dropdownWrapper = ref<HTMLElement | null>(null);
const isOpen = defineModel<boolean>('open', { required: true });

const toggleBudgetActions = () => (isOpen.value = !isOpen.value);
const closeDropdown = () => (isOpen.value = false);

const editBudget = () => {
  emit('edit');
  closeDropdown();
};
const deleteBudget = () => {
  emit('delete');
  closeDropdown();
};

useClickOutside(dropdownWrapper, closeDropdown);
</script>
