<template>
  <article
    v-for="n in 4"
    :key="n"
    class="relative pl-4 flex items-center max-sm:gap-2 sm:gap-4"
  >
    <span class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg bg-grey-200 animate-pulse" />

    <div class="grid gap-1">
      <p class="w-24 h-5 rounded bg-grey-200 animate-pulse" />
      <p class="w-14 h-5 rounded bg-grey-200 animate-pulse" />
    </div>
  </article>
</template>
