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
      class="group relative flex justify-between items-center gap-4 rounded-xl border p-4 text-sm duration-150 ease-in-out cursor-pointer h-full"
      :class="[
        (isOpen || selectedLabel === 'Todos' || selectedLabel)
          ? 'border-grey-900'
          : 'border-grey-300',
        compactOnMobile && 'max-md:hidden',
        formError && 'border-red',
      ]"
    >
      <span
        class="pointer-events-none absolute left-3 origin-[0] -translate-y-1/2 bg-white px-1 text-sm transition-all duration-150 ease-in-out"
        :class="[
          isOpen || selectedLabel === 'Todos' || selectedLabel
            ? 'text-grey-900 scale-90 top-0'
            : 'text-grey-300 scale-100 top-1/2',
        ]"
      >
        {{ label }}
      </span>

      <p class="text-sm text-grey-900 truncate">
        {{ selectedLabel }}
      </p>

      <CaretDownIcon
        class="duration-150 ease-in-out"
        :class="[
          isOpen ? '-rotate-180' : '', selectedLabel === 'Todos' || selectedLabel
            ? 'fill-grey-900'
            : 'fill-grey-300',
          formError && 'fill-red',
        ]"
      />
    </div>

    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        v-bind="fadeSlideY"
        class="absolute bg-white border border-grey-200 max-md:right-0 md:mt-3 z-10 rounded-xl shadow-md overflow-hidden"
        :class="compactOnMobile ? 'max-md:w-max md:w-full max-md:mt-6' : 'w-full max-md:mt-3'"
      >
        <ul
          ref="dropdownList"
          class="max-h-[212px] overflow-y-auto scroll-hide relative"
          @scroll="handleScroll"
        >
          <li
            v-for="option in options"
            :key="getKey(option)"
            class="text-sm p-4 cursor-pointer duration-150 ease-in-out border-b border-grey-100 last:border-b-0"
            :class="isOptionSelected(option) ? 'bg-grey-900 text-white' : 'hover:bg-grey-100'"
            @click.stop="selectOption(option)"
          >
            {{ getLabel(option) }}
          </li>
        </ul>

        <div
          v-if="canScroll"
          class="absolute inset-x-0 p-2 flex justify-center items-center backdrop-blur-[.0625rem] pointer-events-none"
          :class="atBottom ? 'top-0 pt-3 bg-gradient-to-b from-grey-500 to-transparent' : 'bottom-0 bg-gradient-to-t from-grey-500 to-transparent'"
        >
          <div class="w-6 h-6 flex items-center justify-center rounded-full shadow-md bg-grey-500 animate-bounce">
            <CaretDownIcon
              :class="atBottom && 'rotate-180'"
              class="text-grey-400 fill-white"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';
import CaretDownIcon from '~/assets/icons/icon-caret-down.svg';
import { useClickOutside } from '~/composables/useClickOutside';
import type { DropdownProps, DropdownOption } from './dropdown.type';
import { fadeSlideY } from '~/motion/transitions';
import { ref, computed } from 'vue';
import { useDropdownScroll } from './useDropdownScroll';

const { dataTestid, label, options, modelValue, customClasses, iconMobile, compactOnMobile, startEmpty, formError }
  = defineProps<DropdownProps>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const dropdownWrapper = ref<HTMLElement | null>(null);
const dropdownList = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const toggleDropdown = () => (isOpen.value = !isOpen.value);
const closeDropdown = () => (isOpen.value = false);

const getLabel = (option: DropdownOption) => option.name;
const getKey = (option: DropdownOption) => option.id;
const isOptionSelected = (option: DropdownOption) => option.id === modelValue;

const selectedLabel = computed(() => {
  if (startEmpty && !modelValue) {
    return '';
  }

  const valueToFind = modelValue || options[0]?.id;
  const selected = options.find(opt => opt.id === valueToFind);

  return selected ? getLabel(selected) : '';
});

const selectOption = (option: DropdownOption) => {
  const value = option.id || '';
  emit('update:modelValue', value);
  closeDropdown();
};

const { canScroll, atBottom, handleScroll } = useDropdownScroll(dropdownList, isOpen, ref(options));
useClickOutside(dropdownWrapper, closeDropdown);
</script>
