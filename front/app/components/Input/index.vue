<template>
  <label
    :for="name"
    class="relative z-0 w-full grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-grey-300 max-md:py-3 max-md:px-4 md:p-4 duration-150 ease-in-out cursor-text focus-within:border-grey-900 has-[input:not(:placeholder-shown)]:border-grey-900"
    :class="customClasses"
  >
    <input
      :id="name"
      :name="name"
      type="text"
      class="peer block w-full appearance-none bg-transparent text-sm text-grey-900 focus:outline-none focus:ring-0"
      placeholder=" "
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >

    <component
      :is="icon"
      class="fill-grey-300 duration-150 ease-in-out peer-focus:fill-grey-900 peer-[:not(:placeholder-shown)]:fill-grey-900"
    />

    <span
      class="pointer-events-none absolute left-3 top-1/2 z-10 origin-[0] -translate-y-1/2 transform bg-white px-1 text-sm text-grey-300 transition-all duration-150 ease-in-out
        peer-placeholder-shown:scale-100
        peer-focus:top-0 peer-focus:scale-90
        peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-90
        peer-focus:text-grey-900 peer-[:not(:placeholder-shown)]:text-grey-900"
    >
      {{ label }}
    </span>
  </label>
</template>

<script lang="ts" setup>
import type { InputProps } from './input.type';

const { label, modelValue, icon, name, customClasses } = defineProps<InputProps>();

defineEmits<{ (e: 'update:modelValue', value: string): void }>();
</script>
