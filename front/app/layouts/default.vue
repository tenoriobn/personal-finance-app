<template>
  <div class="4xl:bg-beige-300 4xl:h-dvh 4xl:p-12 h-full flex 4xl:items-center">
    <div
      class="bg-beige-100 flex-1 overflow-y-auto lg:grid lg:grid-cols-[auto_1fr] max-md:mb-[56px] md:max-lg:mb-[80px] w-full max-4xl:min-h-dvh 4xl:max-w-[2036px] 4xl:mx-auto 4xl:rounded-3xl 4xl:shadow-2xl 4xl:shadow-grey-900/40 4xl:max-h-[1080px]"
    >
      <Navbar />

      <main class="max-md:py-6 max-md:px-4 md:p-10">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
* {
  scrollbar-width: none;
  scrollbar-color: hsl(252, 7%, 13%) transparent;
}
</style>
