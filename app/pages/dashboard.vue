<script lang="ts" setup>
import type {Calendar} from "~~/types";
import CalendarCreationModal from "~/components/modals/CalendarCreationModal.vue";

definePageMeta({
  middleware: ['auth']
})
const loading = ref(true)
const calendars = ref<Calendar[]>([])
const overlay = useOverlay()
const creationModal = overlay.create(CalendarCreationModal)
const {data, refresh, execute} = useFetch('/api/v1/calendar/list', {
  immediate: false,
  transform: (response) => {
    if (response.statusCode === 200) {
      return response.body as Calendar[]
    }
    return []
  }
})

watch(data, (newData) => {
  calendars.value = newData || []
  loading.value = false
})

onMounted(async () => {
  await execute()
})

async function openCalendarCreation() {
  const instance = creationModal.open()

  const shouldRefresh = await instance.result

  if (shouldRefresh) {
    loading.value = true
    await refresh()
  }
}
</script>

<template>
  <div class="h-screen w-screen bg-black text-white border-r border-white/10">
    <header class="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-black px-4">
      <USeparator orientation="vertical" class="mr-2 h-4 bg-white/10"/>
      <div class="flex items-center justify-between w-full">
        <h1 class="text-white font-semibold">Your Calendars</h1>
        <UButton
            class="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500"
            leading-icon="i-heroicons-plus-16-solid" label="New Calender" @click="openCalendarCreation"/>
      </div>
    </header>
    <main class="py-6">
      <div id="emptyWrapper" class="fixed flex justify-center items-center h-screen w-screen flex-col" v-if="!loading && calendars.length === 0">
        <UIcon name="i-mdi-emoticon-sad" class="h-16 w-16"/>
        <span class="text-white/60 text-lg">You have no calendars yet. Click the button above to create one.</span>
      </div>
      <UContainer>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" v-if="loading">
          <div class="space-y-3" v-for="i in 6" :key="i">
            <USkeleton class="h-6 w-2/3 bg-white/10"/>
            <USkeleton class="h-24 w-full bg-white/10"/>
            <USkeleton class="h-10 w-full bg-white/10"/>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full" v-else >
          <CalendarCard :key="cal.id" :calendar="cal" :refresh="refresh" v-for="cal in calendars"/>
        </div>
      </UContainer>
    </main>
  </div>
</template>