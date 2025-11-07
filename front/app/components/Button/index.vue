<template>
  <button
    :disabled="isSubmitting"
    class="flex items-center justify-center gap-2 border border-grey-900 bg-grey-900 max-sm:text-sm text-sm text-grey-200 stroke-grey-200 font-medium hover:bg-grey-500 hover:border-grey-500 hover:text-grey-200 active:bg-grey-300 active:border-grey-300  active:text-grey-500 active:stroke-grey-500 p-3 rounded-xl duration-150 ease-in-out shadow-lg shadow-grey-500 hover:shadow-grey-300 active:shadow-sm min-w-28 disabled:cursor-not-allowed disabled:hover:bg-grey-900 disabled:hover:border-grey-900 disabled:hover:text-grey-200 disabled:active:bg-grey-900 disabled:active:border-grey-900 disabled:active:text-grey-200 disabled:shadow-none"
  >
    <LoadingIcon
      v-if="isSubmitting"
      class="w-5"
    />
    <template v-else>
      <slot />
      {{ label }}
    </template>
  </button>
</template>

<script lang="ts" setup>
import type { Buttonprops } from './button.type';
import LoadingIcon from '~/assets/icons/loading.svg';

const { label, isSubmitting } = defineProps<Buttonprops>();
</script>
