<template>
  <label
    :for="id"
    class="inline-flex items-center gap-3 select-none"
    :class="[
      isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    ]"
  >
    <input
      :id="id"
      type="checkbox"
      class="sr-only"
      :checked="modelValue"
      :disabled="isSubmitting"
      @change="onChange"
    >
    <span
      class="flex items-center justify-center w-5 h-5 rounded-md border transition-colors"
      :class="modelValue
        ? 'bg-grey-900 border-grey-900'
        : 'bg-white border-grey-900'
      "
    >
      <Check
        v-if="modelValue"
        class="w-4 h-4 text-white"
      />
    </span>

    <span class="text-sm text-grey-900">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import Check from '~/assets/icons/icon-check.svg';

defineProps<{
  modelValue: boolean
  label: string
  id?: string
  isSubmitting?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>
