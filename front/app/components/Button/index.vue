<template>
  <button
    class="flex items-center justify-center gap-2 border border-grey-900 bg-grey-900 max-sm:text-sm text-sm text-grey-200 stroke-grey-200 font-medium hover:bg-grey-500 hover:border-grey-500 hover:text-grey-200 active:bg-grey-300 active:border-grey-300  active:text-grey-500 active:stroke-grey-500 p-3 rounded-xl duration-150 ease-in-out shadow-lg shadow-grey-500 hover:shadow-grey-300 active:shadow-sm min-w-28"
  >
    <slot />
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
import type { Buttonprops } from './button.type';

const { label } = defineProps<Buttonprops>();
</script>
