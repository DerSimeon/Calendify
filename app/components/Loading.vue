<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'

const loaded = ref(false)
const hidden = ref(false)
let timeoutId: number | null = null
let startTime = 0

function finish() {
  if (timeoutId !== null) clearTimeout(timeoutId)
  const elapsed = performance.now() - startTime
  const wait = Math.max(0, 1000 - elapsed)
  timeoutId = window.setTimeout(() => {
    loaded.value = true
    timeoutId = window.setTimeout(() => {
      hidden.value = true
    }, 400)
  }, wait)
}

onMounted(() => {
  startTime = performance.now()
  if (document.readyState === 'complete') {
    finish()
  } else {
    window.addEventListener('load', finish, { once: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('load', finish)
  if (timeoutId !== null) clearTimeout(timeoutId)
})
</script>

<template>
  <div
      v-if="!hidden"
      :aria-hidden="loaded ? 'true' : 'false'"
      :aria-busy="!loaded"
      class="fixed inset-0 z-[60] grid place-items-center transition-opacity duration-300"
      :class="loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'"
      :style="{
      background:
        'radial-gradient(900px 600px at 15% 0%, rgba(217,70,239,0.12), rgba(0,0,0,0) 60%), radial-gradient(900px 600px at 90% 100%, rgba(124,58,237,0.12), rgba(0,0,0,0) 60%), #000000'
    }"
  >
    <div class="flex flex-col items-center gap-4">
      <div class="h-14 w-14 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
        <UIcon name="i-heroicons-calendar-solid" class="h-7 w-7 text-fuchsia-300" aria-hidden="true"/>
        <span class="sr-only">Calendify</span>
      </div>

      <h1
          class="text-white/90 text-lg font-semibold tracking-tight"
          :style="{ letterSpacing: '-0.01em' }"
          aria-live="polite"
      >
        Loading Calendify…
      </h1>

      <div
          class="relative h-1 w-48 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuetext="Loading"
      >
        <div
            class="
      absolute inset-y-0 left-0 w-1/3 rounded-full
      bg-gradient-to-r from-fuchsia-500 to-violet-600
      animate-calendify-loading
      motion-reduce:animate-none
    "
        />
      </div>
    </div>
  </div>
</template>