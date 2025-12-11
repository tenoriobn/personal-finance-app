<template>
  <tr
    v-for="n in 5"
    :key="n"
    class="grid grid-cols-[1fr_auto] grid-rows-2 items-center max-sm:gap-2 sm:gap-x-4 py-4 first:pt-0 last:pb-0"
  >
    <td class="row-span-2 flex items-center max-sm:gap-2 sm:gap-4">
      <span
        class="max-sm:w-8 max-sm:h-8 sm:w-10 sm:h-10 rounded-full bg-grey-200 animate-pulse"
      />

      <span class="w-28 h-5 rounded bg-grey-200 animate-pulse" />
    </td>

    <td class="col-start-3 row-start-2 justify-self-end">
      <span class="block w-20 h-4 rounded bg-grey-200 animate-pulse" />
    </td>

    <td class="col-start-3 row-start-1">
      <span class="block w-20 h-5 rounded bg-grey-200 animate-pulse" />
    </td>
  </tr>
</template>
