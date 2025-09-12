<template>
  <tr
    v-for="n in 5"
    :key="n"
    class="grid max-xl:grid-cols-[auto_1fr_auto] xl:grid-cols-[minmax(300px,1fr)_140px_140px_minmax(100px,1fr)] max-xl:grid-rows-2 items-center max-xl:gap-x-4 max-xl:py-5 xl:gap-6 py-4 last:pb-0"
  >
    <td
      class="max-xl:row-span-2 flex items-center gap-4 text-grey-200 font-bold"
    >
      <svg
        class="w-10 h-10 rounded-full text-grey-200 animate-pulse"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
      </svg>

      <div class="max-xl:hidden w-32 h-5 truncate bg-gray-200 rounded-md animate-pulse" />
    </td>

    <td
      class="max-xl:col-start-2 max-xl:row-start-1 xl:hidden flex items-center gap-4 text-grey-200 font-bold min-w-0"
    >
      <div class="xl:hidden w-32 h-5 truncate bg-gray-200 rounded-md animate-pulse" />
    </td>

    <td
      class="max-xl:col-start-2 max-xl:row-start-2 font-normal truncate"
    >
      <div class="w-32 h-5 truncate bg-gray-200 rounded-md animate-pulse" />
    </td>

    <td
      class="max-xl:col-start-3 max-xl:row-start-2 font-normal truncate"
    >
      <div class="w-20 h-5 block truncate bg-gray-200 rounded-md animate-pulse" />
    </td>
    <td
      class="max-xl:col-start-3 max-xl:row-start-1 text-right font-bold truncate text-grey-200"
    >
      <div class="w-20 h-5 justify-self-end truncate bg-gray-200 rounded-md animate-pulse" />
    </td>
  </tr>
</template>
