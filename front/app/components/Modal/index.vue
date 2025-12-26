<template>
  <div
    v-if="modelValue"
    class="bg-black/65 backdrop-blur-sm fixed top-0 left-0 grid items-center justify-center w-full h-full z-50 max-md:px-4 max-md:py-6 md:p-10 overflow-auto"
    role="presentation"
  >
    <div
      ref="modalContent"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      class="relative rounded-xl bg-grey-900 w-full max-w-lg shadow-2xl shadow-grey-900"
    >
      <header
        class="flex items-center justify-between gap-4 max-md:p-4 md:p-[2rem] border-b border-grey-100"
      >
        <h3
          :id="titleId"
          class="text-lg font-semibold text-grey-100"
        >
          {{ title }}
        </h3>

        <button
          type="button"
          class="text-grey-300 hover:text-grey-500 active:text-grey-200 rounded-xl text-sm flex justify-end items-center duration-150 ease-in-out"
          aria-label="Close modal"
          @click="emit('update:modelValue', false)"
        >
          <CloseModalIcon />
        </button>
      </header>

      <section class="max-md:p-4 md:p-[2rem] bg-white rounded-b-xl">
        <p
          v-if="intro"
          :class="[
            'text-base text-grey-500 whitespace-pre-line',
            introHasSpacing && 'max-md:mb-6 md:mb-[2rem]',
          ]"
        >
          {{ intro }}
        </p>

        <slot />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseModalIcon from '~/assets/icons/icon-close-modal.svg';
import type { ModalProps } from './modal.type';
import { useClickOutside } from '#imports';
import { ref, watchEffect, onBeforeUnmount } from 'vue';

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const { title, intro, modelValue, introHasSpacing = true } = defineProps<ModalProps>();

const modalContent = ref<HTMLElement | null>(null);
const titleId = `modal-title-${Math.random().toString(36).slice(2)}`;

useClickOutside(modalContent, () => emit('update:modelValue', false));

watchEffect(() => {
  document?.body.classList.toggle('overflow-hidden', modelValue);
});

onBeforeUnmount(() => {
  document.body.classList.remove('overflow-hidden');
});
</script>
