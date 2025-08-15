<!-- components/CalendarMonth.vue -->
<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import type { CalendarEvent } from '~~/types/'
import {
  addDays,
  endOfMonth,
  endOfWeek,
  formatMonthYear,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek
} from '~~/lib/date'

const props = defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    required: true
  },
  onDayClick: Function as PropType<(d: Date) => void>,
  onEventClick: Function as PropType<(e: CalendarEvent) => void>
})

const cursor = ref(new Date())

const monthStart = computed(() => startOfMonth(cursor.value))
const monthEnd = computed(() => endOfMonth(cursor.value))
const gridStart = computed(() => startOfWeek(monthStart.value))
const gridEnd = computed(() => endOfWeek(monthEnd.value))

const weeks = computed(() => {
  const ws: Date[][] = []
  let d = new Date(gridStart.value)
  while (d <= gridEnd.value) {
    const row: Date[] = []
    for (let i = 0; i < 7; i++) {
      row.push(new Date(d))
      d = addDays(d, 1)
    }
    ws.push(row)
  }
  return ws
})

console.log(props.events)

const evs = computed(() =>
    props.events.map(e => ({ ...e, start: new Date(e.startTime), end: new Date(e.endTime) }))
)

function segmentsForWeek(week: Date[]) {
  const weekStart = new Date(week[0])
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(week[6])
  weekEnd.setHours(23, 59, 59, 999)

  const segs = evs.value
      .filter(e => e.end.getTime() >= weekStart.getTime() && e.start.getTime() <= weekEnd.getTime())
      .map(e => {
        const startCol = Math.max(0, Math.floor((e.start.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)))
        const endCol = Math.min(6, Math.floor((e.end.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)))
        return {
          id: e.id,
          title: e.title,
          color: e.color,
          startCol,
          endCol,
          startsThisWeek: e.start >= weekStart && e.start <= weekEnd,
          endsThisWeek: e.end >= weekStart && e.end <= weekEnd,
          event: e
        }
      })
      .sort((a, b) => a.startCol - b.startCol || b.endCol - a.endCol)

  const lanes: { endCol: number }[] = []
  const placed: (typeof segs[number] & { lane: number })[] = []
  segs.forEach(s => {
    let lane = 0
    for (; lane < lanes.length; lane++) {
      if (s.startCol > lanes[lane].endCol) {
        lanes[lane].endCol = s.endCol
        placed.push({ ...s, lane })
        return
      }
    }
    lanes.push({ endCol: s.endCol })
    placed.push({ ...s, lane })
  })
  return { placed, laneCount: lanes.length }
}

function eventsForDay(day: Date) {
  return evs.value.filter(e => isWithinInterval(day, e.start, e.end))
}

function colorClass(color: CalendarEvent['color']) {
  switch (color) {
    case 'violet': return { bg: 'bg-violet-500/30', text: 'text-violet-100', border: 'border-violet-400/40' }
    case 'fuchsia': return { bg: 'bg-fuchsia-500/30', text: 'text-fuchsia-100', border: 'border-fuchsia-400/40' }
    case 'emerald': return { bg: 'bg-emerald-500/30', text: 'text-emerald-100', border: 'border-emerald-400/40' }
    case 'rose': return { bg: 'bg-rose-500/30', text: 'text-rose-100', border: 'border-rose-400/40' }
    case 'amber': return { bg: 'bg-amber-500/30', text: 'text-amber-50', border: 'border-amber-400/40' }
  }
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-3">
      <div class="text-lg font-semibold">{{ formatMonthYear(cursor) }}</div>
      <div class="flex items-center gap-2">
        <UButton
            variant="ghost"
            size="sm"
            class="bg-white/5 border border-white/10 text-white"
            @click="cursor = addDays(startOfMonth(cursor), -1)"
        >
          <UIcon name="i-lucide-chevron-left" class="h-4 w-4" />
        </UButton>
        <UButton
            variant="ghost"
            size="sm"
            class="bg-white/5 border border-white/10 text-white"
            @click="cursor = addDays(endOfMonth(cursor), 1)"
        >
          <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
        </UButton>
      </div>
    </div>

    <div class="grid grid-cols-7 text-xs text-white/60 mb-2">
      <div v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d" class="px-2 py-1">
        {{ d }}
      </div>
    </div>

    <div class="rounded-lg overflow-hidden border border-white/10">
      <div
          v-for="(week, idx) in weeks"
          :key="idx"
          class="relative grid grid-cols-7 gap-px bg-white/10"
      >
        <!-- Day cells -->
        <button
            v-for="(day, i) in week"
            :key="i"
            @click="onDayClick && onDayClick(day)"
            class="min-h-28 bg-black/50 p-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
            :class="[
            isSameMonth(day, cursor) ? '' : 'opacity-50',
            isSameDay(day, new Date()) ? 'ring-1 ring-fuchsia-500/60' : ''
          ]"
        >
          <div class="flex items-center justify-between">
            <div class="text-xs text-white/70">{{ day.getDate() }}</div>
            <div
                v-if="eventsForDay(day).length > 3"
                class="text-[10px] text-white/50"
            >
              +{{ eventsForDay(day).length - 3 }}
            </div>
          </div>
        </button>

        <!-- Event bars overlay -->
        <div
            class="pointer-events-none absolute left-0 right-0 top-0 bottom-0 grid grid-cols-7 gap-px px-px"
            :style="{ paddingTop: '1.6rem', paddingBottom: `${Math.max(0, segmentsForWeek(week).laneCount - 1) * 22 + 8}px` }"
            aria-hidden="true"
        >
          <template v-for="(s, i2) in segmentsForWeek(week).placed" :key="`${s.id}-${i2}`">
            <div
                class="relative col-start-auto"
                :style="{
                gridColumn: `${s.startCol + 1} / ${s.endCol + 2}`,
                marginTop: `${s.lane * 22}px`
              }"
            >
              <button
                  @click="onEventClick && onEventClick(s.event)"
                  class="pointer-events-auto w-full truncate rounded-md border px-2 py-1 text-[11px] hover:brightness-110 transition"
                  :class="[colorClass(s.color)?.bg, colorClass(s.color)?.text, colorClass(s.color)?.border]"
                  :title="s.title"
              >
                {{ s.title }}<span v-if="!s.endsThisWeek"> →</span>
              </button>
              <span
                  v-if="!s.startsThisWeek"
                  class="pointer-events-none absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/60 to-transparent"
              />
              <span
                  v-if="!s.endsThisWeek"
                  class="pointer-events-none absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/60 to-transparent"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
