<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} · Personal Finance App` : 'Personal Finance App',
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'author',
      content: 'Bruno Tenório',
    },
    {
      name: 'theme-color',
      content: '#F8F4F0',
    },
    {
      property: 'og:site_name',
      content: 'Personal Finance App',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: '/favicon.svg',
    },

    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
  ],
});
</script>
