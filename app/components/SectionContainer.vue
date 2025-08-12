<script setup lang="ts">
const props = defineProps<{
  className?: string
  id?: string
}>()

const sectionClasses = computed(() => [
  'w-full py-16 md:py-24 lg:py-32',
  props.className,
])
</script>

<template>
  <section :id="props.id" :class="sectionClasses">
    <div class="mx-auto max-w-7xl px-4 md:px-6">
      <slot />
    </div>
  </section>
</template>