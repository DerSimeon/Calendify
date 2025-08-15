<!-- pages/calendars/[slug].vue -->
<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import type {Calendar, CalendarEvent} from '~~/types/'
import DayOverviewModal from "~/components/modals/DayOverviewModal.vue";
import EventOverviewModal from "~/components/modals/EventOverviewModal.vue";
import NewAppointmentModal from "~/components/modals/NewAppointmentModal.vue";

const route = useRoute()
const slug = encodeURIComponent(route.params.slug as string)

const calendar = ref<Calendar | null>(null)
const events = ref<CalendarEvent[]>([])
const loading = ref(true)

const selectedEvent = ref<CalendarEvent | null>(null)
const eventOpen = ref(false)

const selectedDay = ref<Date | null>(null)
const dayOpen = ref(false)
const overlay = useOverlay()
const newAppointmentModal = overlay.create(NewAppointmentModal)
const dayOverviewModal = overlay.create(DayOverviewModal)
const eventOverviewModal = overlay.create(EventOverviewModal)

const {data, refresh, execute} = await useFetch<{statusCode: number; body: Calendar}>(`/api/v1/calendar/by-slug/${slug}`, {
  cache: 'no-store',
  immediate: false,
  onResponseError: (error) => {
    if (error.response.status === 404) {
      calendar.value = null
      events.value = []
    }
  }
})

watch(data, (res) => {
  if (!res) return
  calendar.value = res.body || null
  events.value = res.body.CalendarEvent || []
})

onMounted(async () => {

  loading.value = true
  await execute()
  if (calendar.value) {
    loading.value = false
  }
})

const eventsForSelectedDay = computed(() => {
  if (!selectedDay.value) return []
  return events.value.filter((e) => {
    const d = selectedDay.value!
    const start = new Date(e.startTime)
    const end = new Date(e.endTime)
    const ds = new Date(d);
    ds.setHours(0, 0, 0, 0)
    const de = new Date(d);
    de.setHours(23, 59, 59, 999)
    return start <= de && end >= ds
  })
})

function onDayClick(d: Date) {
  selectedDay.value = d
  dayOpen.value = true
}

function onEventClick(e: CalendarEvent) {
  selectedEvent.value = e
  eventOpen.value = true
}

function openNewAppointmentModal() {
  newAppointmentModal.open()
}
</script>

<template>
  <div class="min-h-[100dvh] bg-black text-white">
    <div v-if="loading" class="mx-auto max-w-7xl px-4 md:px-6 py-8 space-y-4">
      <USkeleton class="h-7 w-64 bg-white/10"/>
      <USkeleton class="h-5 w-96 bg-white/10"/>
      <USkeleton class="h-96 w-full bg-white/10"/>
    </div>

    <div v-else-if="!calendar" class="min-h-[100dvh] grid place-items-center">
      test: {{calendar}}

      <div>Calendar not found</div>
    </div>

    <div v-else class="mx-auto max-w-7xl px-4 md:px-6 py-8 space-y-4">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-2xl md:text-3xl font-semibold">{{ calendar.name }}</h1>
          <UBadge class="bg-white/10 text-white/80 border border-white/10">{{ calendar.slug }}</UBadge>
          <UBadge
              :class="calendar.visibility === 'PUBLIC'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20'
              : 'bg-white/10 text-white/80 border border-white/10'">
            <span class="inline-flex items-center gap-1">
              <UIcon :name="calendar.visibility === 'PUBLIC' ? 'i-lucide-globe' : 'i-lucide-lock'" class="h-3.5 w-3.5"/>
              {{ calendar.visibility === 'PUBLIC' ? 'Public' : 'Private' }}
            </span>
          </UBadge>
        </div>

          <UButton
              class="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500"
              icon="i-lucide-plus-circle"
              @click="openNewAppointmentModal"
              label="New appointment" v-if="calendar.role !== 'VIEWER'"/>
      </div>

      <p class="text-white/70">{{ calendar.name }}</p>

      <div class="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <CalendarMonth :events="events" :onDayClick="onDayClick" :onEventClick="onEventClick"/>
      </div>
    </div>
  </div>
</template>
