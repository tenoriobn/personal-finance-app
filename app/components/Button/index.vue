<template>
  <button
    class="flex items-center justify-center border border-grey-900 bg-grey-900 max-sm:text-sm text-sm text-grey-200 font-medium hover:bg-grey-500 hover:border-grey-500 hover:text-grey-200 active:bg-grey-300 active:border-grey-300  active:text-grey-500 max-md:py-3 max-md:px-2 md:p-4 rounded-xl duration-150 ease-in-out shadow-lg shadow-grey-500 hover:shadow-grey-300 active:shadow-sm"
  >
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
import type { Buttonprops } from './button.type';

const { label } = defineProps<Buttonprops>();
</script>
