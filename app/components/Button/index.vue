<template>
  <button
    class="flex items-center justify-center border border-grey-900 bg-grey-900 max-sm:text-sm text-base text-white font-medium hover:bg-grey-300 hover:border-grey-300 hover:text-grey-900 active:bg-grey-200 active:border-grey-200  active:text-grey-900 max-md:py-3 max-md:px-2 md:p-4 rounded-xl duration-150 ease-in-out "
  >
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
import type { Buttonprops } from './button.type';

const { label } = defineProps<Buttonprops>();
</script>
