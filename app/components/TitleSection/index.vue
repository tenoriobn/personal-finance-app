<template>
  <h2 class="text-grey-900 text-[2rem] font-bold leading-none">{{ title }}</h2>
</template>

<script setup lang="ts">
import type { TitleSectionProps } from './titleSection.type';

const { title } = defineProps<TitleSectionProps>();
</script>
