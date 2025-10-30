import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VCalendar, {});
});
