<template>
  <div
    ref="dropdownWrapper"
    class="relative"
    :class="customClasses"
    :data-testid="dataTestid"
    tabindex="0"
    @click="toggleDropdown"
    @keydown.esc="closeDropdown"
  >
    <component
      :is="iconMobile"
      v-if="iconMobile"
      class="md:hidden fill-grey-900"
    />

    <div
      class="max-md:hidden group relative flex justify-between items-center gap-4 rounded-xl border p-4 text-sm duration-150 ease-in-out cursor-pointer h-full"
      :class="[isOpen || modelValue ? 'border-grey-900' : 'border-grey-300']"
    >
      <span
        class="pointer-events-none absolute left-3 origin-[0] -translate-y-1/2  bg-white px-1 text-sm transition-all duration-150 ease-in-out"
        :class="[(isOpen || modelValue) ? 'text-grey-900 scale-90 top-0' : 'text-grey-300 scale-100 top-1/2']"
      >
        {{ label }}
      </span>

      <p class="text-sm text-grey-900 truncate">{{ modelValue }}</p>

      <CaretDownIcon
        class="duration-150 ease-in-out"
        :class="[isOpen ? '-rotate-180' : '', modelValue ? 'fill-grey-900' : 'fill-grey-300']"
      />
    </div>

    <AnimatePresence>
      <motion.ul
        v-if="isOpen"
        v-bind="fadeSlideY"
        class="absolute bg-white border border-grey-200 max-md:right-0 max-md:mt-6 md:mt-3 max-md:w-max md:w-full z-10 rounded-xl shadow-md overflow-hidden"
      >
        <li
          v-for="option in options"
          :key="option"
          class="text-sm p-4 cursor-pointer duration-150 ease-in-out border-b border-grey-100 last:border-b-0"
          :class="option === modelValue ? 'bg-grey-900 text-white' : 'hover:bg-grey-100'"
          @click.stop="selectOption(option)"
        >
          {{ option }}
        </li>
      </motion.ul>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';
import CaretDownIcon from '~/assets/icons/icon-caret-down.svg';
import { useClickOutside } from '~/composables/useClickOutside';
import type { DropdownProps } from './dropdown.type';
import { fadeSlideY } from '~/motion/transitions';

const { dataTestid, label, options, modelValue, customClasses, iconMobile } = defineProps<DropdownProps>();

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const isOpen = ref(false);
const dropdownWrapper = ref(null);

const toggleDropdown = () => (isOpen.value = !isOpen.value);
const closeDropdown = () => (isOpen.value = false);

const selectOption = (option: string) => {
  emit('update:modelValue', option);
  closeDropdown();
};

useClickOutside(dropdownWrapper, closeDropdown);
</script>
