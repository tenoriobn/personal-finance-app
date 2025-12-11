<template>
  <tr
    v-for="n in 3"
    :key="n"
    class="grid grid-cols-[1fr_auto] items-center max-sm:gap-2 sm:gap-x-4 py-5 last:pb-0 animate-pulse"
  >
    <td class="relative flex flex-1 gap-2 flex-col justify-center pl-4 h-6">
      <span class="absolute bottom-0 left-0 top-0 h-full w-1 rounded bg-grey-200" />
      <div class="max-w-28 h-5 rounded bg-grey-200" />
    </td>

    <td class="w-36 h-5 rounded bg-grey-200" />
  </tr>
</template>
