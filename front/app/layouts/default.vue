<template>
  <div class="5xl:bg-beige-300 5xl:h-dvh 5xl:p-12 h-full flex 5xl:items-center">
    <div
      class="bg-beige-100 5xl:flex-1 5xl:overflow-hidden lg:grid lg:grid-cols-[auto_1fr] lg:grid-rows-[1fr] max-md:mb-[56px] md:max-lg:mb-[80px] w-full max-5xl:min-h-dvh 5xl:max-w-[2036px] 5xl:mx-auto 5xl:rounded-3xl 5xl:shadow-2xl 5xl:shadow-grey-900/40 5xl:max-h-[1080px] 5xl:h-full"
    >
      <Navbar />

      <main class="5xl:overflow-x-hidden 5xl:overflow-y-visible max-md:py-6 max-md:px-4 md:p-10">
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
