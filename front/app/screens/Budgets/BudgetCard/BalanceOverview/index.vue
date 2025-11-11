<template>
  <div class="flex items-center mt-4">
    <div class="relative flex flex-1 flex-col justify-between pl-4">
      <span
        class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg bg-green"
        :style="{ backgroundColor: colorHex || '#ccc' }"
      />
      <p class="text-sm text-grey-500">Gasto</p>
      <p class="font-bold text-grey-900">{{ formatCurrency(spent, false) }}</p>
    </div>

    <div class="relative flex flex-1 flex-col justify-between pl-4">
      <span class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg bg-beige-100" />
      <p class="text-sm text-grey-500">Livre</p>
      <p class="font-bold text-grey-900">{{ formatCurrency(free) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ colorHex?: string, spent: number, free: number }>();
</script>
