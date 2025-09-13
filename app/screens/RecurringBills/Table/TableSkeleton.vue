<template>
  <tr
    v-for="n in 2"
    :key="n"
    class="grid items-center max-md:grid-cols-[auto_1fr_auto] max-md:grid-rows-2 max-md:gap-x-4 md:grid-cols-[minmax(180px,1fr)_140px_minmax(90px,1fr)] md:gap-6 py-4 last:pb-0"
  >
    <td
      class="max-md:col-start-1 max-md:col-end-3 max-md:row-span-2 flex items-center gap-4 text-grey-200 font-bold"
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

      <div class="w-32 h-5 truncate bg-gray-200 rounded-md animate-pulse" />
    </td>

    <td
      class="max-md:col-start-3 max-md:row-start-2 flex items-center gap-1 text-grey-200 font-bold min-w-0"
    >
      <div class="max-sm:w-20 sm:w-28 h-5 truncate bg-gray-200 rounded-md animate-pulse" />
    </td>

    <td
      class="justify-items-end max-md:col-start-3 max-md:row-start-1 font-normal truncate"
    >
      <div class="max-sm:w-20 sm:w-28 h-5 truncate bg-gray-200 rounded-md animate-pulse" />
    </td>
  </tr>
</template>
