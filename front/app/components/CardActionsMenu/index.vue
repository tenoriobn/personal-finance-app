<template>
  <div
    ref="actionsDropdownWrapper"
    class="relative grid"
  >
    <button
      type="button"
      class="opacity-50 hover:opacity-100 duration-150 ease-in-out relative"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      aria-label="Abrir menu de ações"
      data-testid="actions-toggle"
      @click="toggleBudgetActions"
    >
      <DotsIcon />
    </button>

    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        role="menu"
        class="absolute bg-white border border-grey-200 right-0 mt-6 z-10 rounded-xl shadow-md overflow-hidden w-max max-w-[156px]"
        v-bind="fadeSlideY"
      >
        <ul class="max-h-[212px] overflow-y-auto scroll-hide relative">
          <li>
            <button
              type="button"
              role="menuitem"
              data-testid="edit-action"
              class="text-grey-900 hover:text-grey-500 active:text-grey-300 text-sm font-medium p-4 w-full text-left duration-150 ease-in-out border-b border-grey-100"
              @click="editBudget"
            >
              {{ editLabel }}
            </button>
          </li>

          <li>
            <button
              type="button"
              role="menuitem"
              data-testid="delete-action"
              class="text-red hover:text-red/85 active:text-red/55 text-sm font-medium p-4 w-full text-left duration-150 ease-in-out"
              @click="deleteBudget"
            >
              {{ deleteLabel }}
            </button>
          </li>
        </ul>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script lang="ts" setup>
import DotsIcon from '~/assets/icons/icon-dots.svg';
import { motion, AnimatePresence } from 'motion-v';
import { fadeSlideY } from '~/motion/transitions';
import { useClickOutside } from '~/composables';
import { ref } from 'vue';
import type { CardActionsMenuProps } from './cardActionsMenu.type';

const { editLabel, deleteLabel } = defineProps<CardActionsMenuProps>();

const isOpen = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{ (e: 'edit' | 'delete'): void }>();

const actionsDropdownWrapper = ref<HTMLElement | null>(null);

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

useClickOutside(actionsDropdownWrapper, closeDropdown);
</script>
