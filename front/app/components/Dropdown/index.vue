<template>
  <div
    ref="dropdownWrapper"
    class="relative"
    :class="[
      customClasses,
      isSubmitting && 'opacity-60 cursor-not-allowed',
    ]"
    :data-testid="dataTestid"
    tabindex="0"
    @click="!isSubmitting && toggleDropdown()"
    @keydown.esc="!isSubmitting && closeDropdown()"
  >
    <component
      :is="iconMobile"
      v-if="iconMobile"
      class="md:hidden fill-grey-900"
    />

    <div
      class="group relative flex justify-between items-center gap-4 rounded-xl border p-4 text-sm duration-150 ease-in-out h-full"
      :class="[
        isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer',
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

      <div class="flex items-center gap-2">
        <span
          v-if="selectedColorHex"
          class="block w-4 h-4 rounded-full"
          :style="{ backgroundColor: selectedColorHex }"
        />

        <p class="text-sm text-grey-900 truncate">
          {{ selectedLabel }}
        </p>
      </div>

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
            class="flex items-center gap-2 text-sm p-4 cursor-pointer duration-150 ease-in-out border-b border-grey-100 last:border-b-0 select-none"
            :class="isOptionSelected(option) ? 'bg-grey-900 text-white' : 'hover:bg-grey-100'"
            :data-selected="isOptionSelected(option)"
            @click.stop="selectOption(option)"
          >
            <span
              v-if="option.colorHex"
              class="block w-4 h-4 rounded-full"
              :style="{ backgroundColor: option.colorHex }"
            />

            {{ getLabel(option) }}
          </li>
        </ul>

        <div
          v-if="canScrollUp"
          class="absolute top-0 inset-x-0 p-2 flex justify-center cursor-pointer
         bg-gradient-to-b from-grey-500 to-transparent backdrop-blur-[.0625rem] select-none"
          @click.stop="scrollByOptions(-2)"
        >
          <div class="w-4 h-4 flex items-center justify-center rounded-full shadow-md bg-grey-500 animate-bounce">
            <CaretDownIcon class="rotate-180 fill-white scale-75" />
          </div>
        </div>

        <div
          v-if="canScrollDown"
          class="absolute bottom-0 inset-x-0 p-2 flex justify-center cursor-pointer
         bg-gradient-to-t from-grey-500 to-transparent backdrop-blur-[.0625rem] select-none"
          @click.stop="scrollByOptions(2)"
        >
          <div class="w-4 h-4 flex items-center justify-center rounded-full shadow-md bg-grey-500 animate-bounce">
            <CaretDownIcon class="fill-white scale-75" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';
import CaretDownIcon from '~/assets/icons/icon-caret-down.svg';
import { useClickOutside } from '~/composables';
import type { DropdownProps, DropdownOption } from './dropdown.type';
import { fadeSlideY } from '~/motion/transitions';
import { ref, computed } from 'vue';
import { useDropdownScroll } from './useDropdownScroll';

const {
  dataTestid, label, options, modelValue, customClasses, iconMobile, compactOnMobile, startEmpty, formError, isSubmitting,
}
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

const selectedColorHex = computed(() => {
  if (!selectedLabel.value) {
    return null;
  }
  const match = options.find(opt => getLabel(opt) === selectedLabel.value);
  return match?.colorHex || null;
});

const selectOption = (option: DropdownOption) => {
  const value = option.id || '';
  emit('update:modelValue', value);
  closeDropdown();
};

const {
  canScrollUp,
  canScrollDown,
  handleScroll,
  scrollByOptions,
} = useDropdownScroll(dropdownList, isOpen, ref(options));

useClickOutside(dropdownWrapper, closeDropdown);
</script>
