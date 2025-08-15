<!-- components/NewEventModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

type Color = 'violet' | 'fuchsia' | 'emerald' | 'rose' | 'amber'
const COLORS: Color[] = ['violet', 'fuchsia', 'emerald', 'rose', 'amber']

const props = defineProps<{
  slug: string
  defaultDate?: Date
}>()

const emit = defineEmits<{ (e: 'created'): void }>()

const open = ref(false)
const title = ref('')
const color = ref<Color>('violet')

function toLocalInput(dt: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`
}

const startInit = props.defaultDate ? new Date(props.defaultDate) : new Date()
const endInit = new Date(startInit.getTime() + 60 * 60 * 1000)

const start = ref(toLocalInput(startInit))
const end = ref(toLocalInput(endInit))
const saving = ref(false)

async function submit() {
  if (!title.value.trim() || saving.value) return
  saving.value = true
  try {
    await $fetch(`/api/calendars/by-slug/${props.slug}/events`, {
      method: 'POST',
      body: {
        title: title.value,
        startISO: new Date(start.value).toISOString(),
        endISO: new Date(end.value).toISOString(),
        color: color.value
      }
    })
    open.value = false
    title.value = ''
    emit('created')
  } finally {
    saving.value = false
  }
}

function colorToClass(c: Color) {
  switch (c) {
    case 'violet': return { bg: 'bg-violet-500/30', border: 'border-violet-400/40' }
    case 'fuchsia': return { bg: 'bg-fuchsia-500/30', border: 'border-fuchsia-400/40' }
    case 'emerald': return { bg: 'bg-emerald-500/30', border: 'border-emerald-400/40' }
    case 'rose': return { bg: 'bg-rose-500/30', border: 'border-rose-400/40' }
    case 'amber': return { bg: 'bg-amber-500/30', border: 'border-amber-400/40' }
  }
}
</script>

<template>
  <div>
    <!-- Optional trigger slot. Use like:
         <NewEventModal v-slot:trigger="{ open }">
           <UButton @click="open()">New appointment</UButton>
         </NewEventModal>
    -->
    <slot name="trigger" :open="() => (open = true)">
      <UButton
          class="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500"
          icon="i-lucide-plus-circle"
          @click="open = true"
      >
        New appointment
      </UButton>
    </slot>

    <UModal v-model="open" :ui="{ width: 'max-w-lg' }">
      <div class="p-4 sm:p-6 bg-black text-white border border-white/10 rounded-xl">
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-calendar" class="h-5 w-5 text-fuchsia-300" />
          <h2 class="text-lg font-semibold">Create a new appointment</h2>
        </div>

        <div class="space-y-4">
          <UFormGroup label="Title" for="ev-title">
            <UInput
                id="ev-title"
                v-model="title"
                placeholder="Team sync, launch, etc."
                :ui="{ base: 'bg-white/5 border-white/10 text-white placeholder:text-white/40' }"
                autofocus
            />
          </UFormGroup>

          <div class="grid gap-3 sm:grid-cols-2">
            <UFormGroup label="Start" for="ev-start">
              <UInput
                  id="ev-start"
                  type="datetime-local"
                  v-model="start"
                  :ui="{ base: 'bg-white/5 border-white/10 text-white' }"
              />
            </UFormGroup>

            <UFormGroup label="End" for="ev-end">
              <UInput
                  id="ev-end"
                  type="datetime-local"
                  v-model="end"
                  :ui="{ base: 'bg-white/5 border-white/10 text-white' }"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Color">
            <div class="flex flex-wrap gap-2">
              <button
                  v-for="c in ['violet','fuchsia','emerald','rose','amber']"
                  :key="c"
                  type="button"
                  :aria-label="`Select ${c} color`"
                  @click="color = c as any"
                  class="h-8 w-8 rounded-full border"
                  :class="[ c === color ? 'ring-2 ring-white' : '', colorToClass(c as any).bg, colorToClass(c as any).border ]"
              />
            </div>
          </UFormGroup>
        </div>

        <div class="mt-6 flex justify-end">
          <UButton
              :disabled="saving || !title.trim()"
              :loading="saving"
              class="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500"
              @click="submit"
          >
            {{ saving ? 'Creating...' : 'Create' }}
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>
