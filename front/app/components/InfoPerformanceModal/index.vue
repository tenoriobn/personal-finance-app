<template>
  <ClientOnly>
    <Teleport to="body">
      <Modal
        v-model="visible"
        title="Aviso sobre desempenho"
        :intro-has-spacing="false"
      >
        <AlertIcon class="w-16 h-16 mx-auto mb-4" />

        <p class="text-sm text-grey-500 whitespace-pre-line">
          Este é um projeto sem fins lucrativos, hospedado em infraestrutura gratuita.<br>

          Em alguns momentos, especialmente no primeiro acesso, pode ocorrer
          lentidão nas requisições iniciais.<br>

          Após o carregamento, a navegação funciona normalmente.
        </p>
      </Modal>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import AlertIcon from '~/assets/icons/icon-alert.svg';

const STORAGE_KEY = 'performance-warning-seen';

const visible = ref(false);

onMounted(() => {
  const alreadySeen = localStorage.getItem(STORAGE_KEY);
  if (!alreadySeen) {
    visible.value = true;
  }
});

watch(visible, (isOpen) => {
  if (!isOpen) {
    localStorage.setItem(STORAGE_KEY, 'true');
  }
});
</script>
