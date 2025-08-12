<script lang="ts" setup>
const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<template>
  <UApp>
    <Loading/>
    <NuxtPage/>
  </UApp>
</template>
