<template>
  <nav
    id="primary-navigation"
    aria-label="Menu principal"
    class="duration-150 ease-in-out"
    :class="isCollapsed ? 'lg:w-[100px]' : 'lg:w-[252px] 2xl:w-[300px]'"
  >
    <div
      class="bg-grey-900 fixed max-lg:bottom-0 max-lg:left-0 max-lg:w-full max-lg:rounded-t-lg lg:max-4xl:rounded-r-2xl 4xl:rounded-3xl lg:max-4xl:h-dvh 4xl:h-[calc(100%-96px)] 4xl:max-h-[1080px] duration-150 ease-in-out overflow-hidden z-50"
      :class="isCollapsed ? 'lg:w-[100px]' : 'lg:w-[252px] 2xl:w-[300px]'"
    >
      <div
        class="max-lg:pt-2 max-md:px-4 md:max-lg:px-10 lg:py-10 lg:flex lg:flex-col gap-16 h-full overflow-auto navbar__scroll-container"
        :class="isCollapsed ? 'lg:pr-2' : 'lg:pr-6'"
      >
        <div
          class="max-lg:hidden lg:pl-[2.25rem] overflow-hidden lg:shrink-0 duration-150 ease-in-out"
          :class="isCollapsed ? 'lg:max-w-[49px]' : 'lg:max-w-full'"
        >
          <Logo />
        </div>

        <ul class="max-lg:flex max-lg:justify-between lg:grow">
          <li
            v-for="{ to, label, icon } in navLinks"
            :key="to"
            class="w-full"
          >
            <NuxtLink
              :to="to"
              class="group relative flex max-lg:flex-col items-center max-lg:justify-center md:max-lg:flex-col md:max-lg:gap-2 lg:gap-6 max-lg:rounded-t-lg lg:rounded-r-2xl max-lg:border-b-4 lg:border-l-4 max-lg:p-3 lg:p-4 lg:pl-8 w-full max-lg:max-w-28 overflow-hidden lg:min-h-14"
              :class="route.path === to ? 'border-green bg-beige-100 glow-effect' : 'border-transparent'"
            >
              <component
                :is="icon"
                class="duration-150 ease-in-out h-5 lg:shrink-0"
                :class="route.path === to ? 'fill-green' : 'fill-grey-300 group-hover:fill-grey-100'"
              />

              <span
                class="max-md:hidden md:block max-lg:text-xs font-bold text-nowrap overflow-hidden lg:grow duration-150 ease-in-out"
                :class="[
                  route.path === to ? 'text-grey-900' : 'text-grey-300 group-hover:text-grey-100',
                  isCollapsed ? 'lg:max-w-0' : 'lg:max-w-full',
                ]"
              >
                {{ label }}
              </span>
            </NuxtLink>
          </li>
        </ul>

        <button
          class="group hidden font-bold lg:flex items-center gap-5 hover:text-grey-100 lg:mx-[2.25rem] transition-colors lg:shrink-0"
          type="button"
          :aria-expanded="!isCollapsed"
          aria-controls="primary-navigation"
          :class="isCollapsed && 'lg:min-h-6'"
          data-testid="colapse-navbar"
          @click="toggleNavbar"
        >
          <div
            class="lg:flex items-center gap-5 lg:shrink-0 duration-150 ease-in-out"
            :class="isCollapsed ? 'rotate-180' : 'rotate-0'"
          >
            <MinimizeMenuIcon
              class="fill-grey-300 group-hover:fill-grey-100 duration-150 ease-in-out transition-colors "
            />
          </div>

          <span
            tag="span"
            class="max-md:hidden md:block max-lg:text-xs font-bold text-left text-nowrap overflow-hidden lg:grow text-grey-300 group-hover:text-grey-100 duration-150 ease-in-out"
            :class="isCollapsed ? 'lg:max-w-0' : 'lg:max-w-full'"
          >
            Ocultar Menu
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import Logo from '~/assets/icons/logo-large.svg';
import MinimizeMenuIcon from '~/assets/icons/icon-minimize-menu.svg';
import { navLinks } from './navLinks';
import { useNavbarCollapse } from './useNavbarCollapse';

const route = useRoute();

const { isCollapsed, toggleNavbar } = useNavbarCollapse();

defineExpose({ isCollapsed });
</script>

<style scoped>
@keyframes glow-pulse {
  0%, 100% {
    opacity: .6;
  }
  50% {
    opacity: 1;
  }
}

.navbar__scroll-container {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.navy-grey') transparent;
}

.glow-effect::before {
  content: '';
  position: absolute;
  left: 0;
  animation: glow-pulse 3.5s infinite ease-in-out;
  z-index: 0;
  pointer-events: none;
}

@media (max-width: 991px) {
  .glow-effect::before {
    bottom: 0;
    height: 24px;
    width: 100%;
    background: linear-gradient(to top, theme('colors.green-transparent') 0%, transparent 50%);
  }
}

@media (min-width: 992px) {
  .glow-effect::before {
    top: 0;
    height: 100%;
    width: 32px;
    background: linear-gradient(to right, theme('colors.green-transparent') 0%, transparent 60%);
  }
}
</style>
