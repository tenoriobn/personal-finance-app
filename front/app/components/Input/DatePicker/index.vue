<template>
  <div
    ref="containerRef"
    class="relative w-full"
  >
    <Input
      :model-value="displayValue"
      :label="label"
      :name="name"
      :custom-classes="customClasses"
      readonly
      :disable-autocomplete="true"
      @click="openCalendar"
      @focusin="openCalendar"
      @keydown.prevent
    />

    <div
      v-show="showCalendar"
      class="absolute top-full mt-2 left-0 z-50 calendar-container"
    >
      <VDatePicker
        v-model="internalDate"
        trim-weeks
        :is-inline="true"
        :min-date="minDate"
        class="bg-grey-100 p-2 rounded-lg shadow-lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '#components';
import { ref, computed, watch } from 'vue';
import type { DatePickerProps } from './datePicker.type';
import { useClickOutside } from '~/composables';

const { modelValue, label, name, customClasses } = defineProps<DatePickerProps>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const showCalendar = ref(false);
const internalDate = ref<Date | null>(null);

const minDate = new Date();
minDate.setHours(0, 0, 0, 0);

const displayValue = computed(() =>
  internalDate.value ? internalDate.value.toLocaleDateString('pt-BR') : '',
);

watch(
  () => modelValue,
  (iso) => {
    if (!iso) {
      internalDate.value = null;
      return;
    }
    const date = new Date(iso);
    internalDate.value = isNaN(date.getTime()) ? null : date;
  },
  { immediate: true },
);

watch(internalDate, (date) => {
  if (!date) {
    return;
  }
  emit('update:modelValue', date.toISOString());
  showCalendar.value = false;
});

function openCalendar() {
  showCalendar.value = true;
}

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => {
  showCalendar.value = false;
});
</script>

<style scoped>
::v-deep(.vc-container),
::v-deep(.vc-popover-content) {
  @apply bg-white text-grey-900 font-publicSans;
}

::v-deep(.vc-header .vc-title),
::v-deep(.vc-base-icon),
::v-deep(.vc-weekday) {
  @apply text-grey-900;
}

::v-deep(.vc-header .vc-arrow:hover),
::v-deep(.vc-nav-item:hover),
::v-deep(.vc-nav-arrow:hover),
::v-deep(.vc-nav-title:hover) {
  @apply bg-grey-200;
}

::v-deep(.vc-highlight-bg-solid),
::v-deep(.vc-nav-item.is-active) {
  @apply bg-grey-900 relative z-[10];
}

::v-deep(.vc-day:not(.is-active) .vc-day-content:hover) {
  @apply bg-grey-200;
}

::v-deep(.vc-focus:focus-within) {
 @apply ring-2 ring-grey-200;
}

::v-deep(.vc-day-content.vc-disabled),
::v-deep(.vc-nav-item:disabled) {
  @apply text-grey-300 opacity-65 font-light;
}

::v-deep(.is-not-in-month) {
  visibility: hidden;
}

::v-deep(.vc-nav-item.is-current) {
  @apply text-grey-500
}
</style>
