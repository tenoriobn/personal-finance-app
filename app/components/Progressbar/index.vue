<template>
  <div class="rounded bg-beige-100 mt-4">
    <div
      aria-valuemax="100"
      aria-valuemin="0"
      role="progressbar"
      data-max="100"
      class="relative w-full overflow-hidden rounded bg-transparent"
      :class="customClasses"
    >
      <div
        data-max="100"
        class="h-full w-full flex-1 transition-all"
        style="transform: translateX(-60%); background-color: rgb(39, 124, 120);"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProgressBarProps } from './progressBar.type';

const { customClasses } = defineProps<ProgressBarProps>();
</script>
