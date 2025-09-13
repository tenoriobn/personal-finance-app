<template>
  <div
    v-if="modelValue"
    class="bg-black/65 backdrop-blur-sm fixed top-0 left-0 grid items-center justify-center w-full h-full z-50 max-md:px-4 max-md:py-6 md:p-10 overflow-auto"
  >
    <div
      ref="modalContent"
      class="relative rounded-xl bg-grey-900 w-full max-w-lg shadow-2xl shadow-grey-900"
    >
      <div class="flex items-center justify-between gap-4 max-md:p-4 md:p-[2rem] border-b border-grey-100">
        <h3 class="text-lg font-semibold text-grey-100">
          {{ title }}
        </h3>

        <button
          class="text-grey-300 hover:text-grey-500 active:text-grey-200 rounded-xl text-sm flex justify-end items-center duration-150 ease-in-out"
          @click="emit('update:modelValue', false)"
        >
          <CloseModalIcon />
        </button>
      </div>

      <div class="max-md:p-4 md:p-[2rem] bg-white rounded-b-xl">
        <p
          v-if="intro"
          class="text-base text-grey-500 max-md:mb-6 md:mb-[2rem]"
        >
          {{ intro }}
        </p>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseModalIcon from '~/assets/icons/icon-close-modal.svg';
import type { ModalProps } from './modal.type';
import { useClickOutside } from '#imports';

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();
const modalContent = ref(null);
useClickOutside(modalContent, () => emit('update:modelValue', false));

watchEffect(() => {
  document?.body.classList.toggle('overflow-hidden', modelValue);
});

onBeforeUnmount(() => {
  document.body.classList.remove('overflow-hidden');
});

const { title, intro, modelValue } = defineProps<ModalProps>();
</script>

<style>
color {
  color: hsl(0, 0%, 0%, 0.651)
}
</style>
