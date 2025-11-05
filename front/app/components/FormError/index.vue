<template>
  <p
    v-if="message"
    class="text-red text-sm"
  >
    {{ message }}
  </p>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>();
</script>
