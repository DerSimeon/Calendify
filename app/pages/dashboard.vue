<script lang="ts" setup>
import type {Calendar} from "~~/types";

definePageMeta({
  middleware: ['auth']
})
const loading = ref(true)
const calendars = ref<Calendar[]>([])
const {data, refresh, execute} = useFetch('/api/v1/calendar/list', {
  immediate: false,
  transform: (response) => {
    if (response.statusCode === 200) {
      return response.body as Calendar[]
    }
    return []
  }
})

onMounted(async () => {
  await execute()
  calendars.value = data.value || []
  loading.value = false
})
</script>

<template>
  <div class="h-screen w-screen bg-black text-white border-r border-white/10">
    <header class="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-black px-4">
      <USeparator orientation="vertical" class="mr-2 h-4 bg-white/10"/>
      <div class="flex items-center justify-between w-full">
        <h1 class="text-white font-semibold">Your Calendars</h1>
        <UButton
            class="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500"
            leading-icon="i-heroicons-plus-16-solid" label="New Calender"/>
      </div>
    </header>
    <main class="py-6">
      <UContainer>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" v-if="loading">
          <div class="space-y-3" v-for="i in 6" :key="i">
            <USkeleton class="h-6 w-2/3 bg-white/10"/>
            <USkeleton class="h-24 w-full bg-white/10"/>
            <USkeleton class="h-10 w-full bg-white/10"/>
          </div>
        </div>
        <div class="text-white/70 text-sm" v-else-if="!loading && calendars.length === 0">No calendars yet. Create one
          to get started.
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" v-else v-for="cal in calendars">
          <CalendarCard :key="cal.id" :calendar="cal" @change="refresh()"/>
        </div>
      </UContainer>
    </main>
  </div>
</template>