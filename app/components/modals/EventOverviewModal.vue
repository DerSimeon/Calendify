<!-- components/EventOverviewModal.vue -->
<script setup lang="ts">
import {ref} from 'vue'
import type {CalendarEvent} from '@/types/calendar'

const props = defineProps<{
  event: CalendarEvent | null
  open: boolean
  slug?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'updated'): void
  (e: 'deleted'): void
}>()

const editOpen = ref(false)
const deleting = ref(false)
const toast = useToast()

async function handleDelete() {
  if (!props.event || !props.slug) return
  deleting.value = true
  try {
    const json = await $fetch<{ ok?: boolean; error?: string }>(
        `/api/v1/calendars/by-slug/${props.slug}/events/${props.event.id}`,
        {method: 'DELETE'}
    )
    emit('update:open', false)
    emit('deleted')
    toast.add({title: 'Event deleted', description: 'The appointment was removed.'})
  } catch (e: any) {
    toast.add({title: 'Could not delete', description: e?.data?.message || e?.message || 'Unknown error', color: 'red'})
  } finally {
    deleting.value = false
  }
}

const start = computed(() => props.event ? new Date(props.event.startISO) : null)
const end = computed(() => props.event ? new Date(props.event.endISO) : null)

function colorDot(color: CalendarEvent['color']) {
  switch (color) {
    case 'violet':
      return 'bg-violet-400'
    case 'fuchsia':
      return 'bg-fuchsia-400'
    case 'emerald':
      return 'bg-emerald-400'
    case 'rose':
      return 'bg-rose-400'
    case 'amber':
      return 'bg-amber-300'
  }
}
</script>

<template>
  <UModal :model-value="open" @update:model-value="emit('update:open', $event)" v-if="event"
          :ui="{ width: 'max-w-md' }">
    <div class="p-4 sm:p-6 bg-black text-white border border-white/10 rounded-xl">
      <h2 class="text-lg font-semibold mb-3">{{ event.title }}</h2>

      <div class="text-sm text-white/80 space-y-2">
        <div>
          <span class="text-white/60">Starts: </span>{{ start?.toLocaleString() }}
        </div>
        <div>
          <span class="text-white/60">Ends: </span>{{ end?.toLocaleString() }}
        </div>
        <div class="flex items-center gap-2">
          <span class="text-white/60">Color:</span>
          <span class="inline-block h-3 w-3 rounded-full" :class="colorDot(event.color)"/>
        </div>
      </div>

      <div v-if="slug" class="flex items-center gap-2 pt-4">
        <UButton variant="soft" size="sm" class="bg-white/5 border-white/10 text-white hover:bg-white/10"
                 @click="editOpen = true">
          <UIcon name="i-lucide-edit-3" class="h-4 w-4 mr-2"/>
          Edit
        </UButton>
        <UButton
            variant="soft"
            size="sm"
            :disabled="deleting"
            class="bg-rose-500/10 border-rose-400/20 text-rose-300 hover:bg-rose-500/20"
            @click="handleDelete"
        >
          <UIcon name="i-lucide-trash-2" class="h-4 w-4 mr-2"/>
          {{ deleting ? 'Deleting...' : 'Delete' }}
        </UButton>
      </div>
    </div>
  </UModal>

  <!-- Keep your existing EditEventDialog, or convert similarly -->
  <EditEventDialog
      v-if="slug && event"
      :slug="slug!"
      :event="event"
      :open="editOpen"
      @update:open="editOpen = $event"
      @updated="() => { emit('updated'); editOpen = false }"
  />
</template>
