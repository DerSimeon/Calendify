<!-- components/DayOverviewModal.vue -->
<script setup lang="ts">
import type { CalendarEvent } from '@/types/calendar'

const props = defineProps<{
  date: Date | null
  events: CalendarEvent[]
  open: boolean
  slug?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'select-event', ev: CalendarEvent): void
  (e: 'event-created'): void
}>()

const dayStr = computed(() =>
    props.date
        ? props.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        : ''
)

function colorDot(color: CalendarEvent['color']) {
  switch (color) {
    case 'violet': return 'bg-violet-400'
    case 'fuchsia': return 'bg-fuchsia-400'
    case 'emerald': return 'bg-emerald-400'
    case 'rose': return 'bg-rose-400'
    case 'amber': return 'bg-amber-300'
  }
}
</script>

<template>
  <UModal :model-value="open" @update:model-value="emit('update:open', $event)" v-if="date" :ui="{ width: 'max-w-md' }">
    <div class="p-4 sm:p-6 bg-black text-white border border-white/10 rounded-xl">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">{{ dayStr }}</h2>

        <NewEventModal
            v-if="slug"
            :slug="slug!"
            :default-date="date!"
            @created="() => { emit('event-created'); emit('update:open', false) }"
            v-slot:trigger="{ open }"
        >
          <UButton
              size="sm"
              class="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500"
              @click="open()"
          >
            <UIcon name="i-lucide-plus-circle" class="h-4 w-4 mr-2" />
            Add
          </UButton>
        </NewEventModal>
      </div>

      <ul class="space-y-2">
        <li v-if="events.length === 0" class="text-white/70 text-sm">No appointments</li>
        <li v-else v-for="e in events" :key="e.id">
          <button
              class="w-full text-left rounded-md border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition"
              @click="emit('select-event', e)"
          >
            <div class="flex items-center gap-2">
              <span class="inline-block h-2.5 w-2.5 rounded-full" :class="colorDot(e.color)" />
              <span class="font-medium">{{ e.title }}</span>
            </div>
            <div class="text-xs text-white/60 mt-0.5">
              {{ new Date(e.startISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} –
              {{ new Date(e.endISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </button>
        </li>
      </ul>
    </div>
  </UModal>
</template>
