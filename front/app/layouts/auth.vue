<template>
  <main class="bg-beige-100 lg:min-h-dvh lg:grid lg:place-items-center lg:p-10">
    <div
      class="grid max-lg:grid-rows-[auto_1fr] w-full max-w-[1240px] lg:max-h-[912px] max-lg:min-h-dvh lg:bg-white lg:grid-cols-2 lg:h-full max-lg:gap-10 lg:rounded-2xl max-lg:pb-10"
    >
      <header
        class="background grid max-lg:place-items-center max-lg:bg-grey-900 max-lg:py-8 lg:p-10 max-lg:rounded-b-2xl lg:rounded-2xl"
      >
        <Logo />

        <div class="max-lg:hidden self-end backdrop-blur-xl bg-white/5 p-6 rounded-2xl">
          <h3 class="text-white text-[1.75rem] font-bold leading-none">
            Controle suas finanças e poupe para o futuro.
          </h3>
          <p class="text-white text-base mt-4">
            O aplicativo de finanças pessoais coloca você no controle dos seus gastos.
            Monitore transações, defina orçamentos e adicione dinheiro às suas poupanças
            com facilidade.
          </p>
        </div>
      </header>

      <section class="grid place-items-center max-md:px-4">
        <div
          class="max-lg:bg-white flex flex-col justify-center gap-8 w-full max-lg:p-6 lg:p-10 rounded-2xl max-lg:max-w-[560px]"
        >
          <slot />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import Logo from '~/assets/icons/logo-large.svg';
</script>

<style scoped>
@media (min-width: 992px) {
  .background {
    background-image: url('../assets/images/illustration-authentication.svg');
    background-size: cover;
    background-position: top;
  }
}
</style>
