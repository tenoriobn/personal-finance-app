<template>
  <div
    class="rounded bg-beige-100 mt-4"
    :class="containerPadding || 'p-1'"
  >
    <div
      aria-valuemax="100"
      aria-valuemin="0"
      role="progressbar"
      data-max="100"
      class="relative w-full overflow-hidden rounded bg-transparent"
      :class="barHeight || 'h-6'"
    >
      <div
        data-max="100"
        class="h-full w-full flex-1 transition-all"
        :style="{
          transform: `translateX(-${100 - (percent || 0)}%)`,
          backgroundColor: colorHex || '#ccc',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ colorHex?: string, percent?: number, containerPadding?: string, barHeight?: string }>();
</script>
