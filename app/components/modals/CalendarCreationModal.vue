<script setup lang="ts">
import {ref} from 'vue'
import type {Calendar as CalendarType} from '~~/types/'

const emit = defineEmits<{ close: [boolean] }>()

const title = ref('')
const description = ref('')
const isPublic = ref(false)
const saving = ref(false)

const toast = useToast()

async function submit() {
  if (!title.value.trim() || saving.value) return
  saving.value = true
  try {
    await $fetch<{ calendar: CalendarType; error?: string }>('/api/v1/calendar', {
      method: 'POST',
      body: {
        title: title.value,
        description: description.value,
        visibility: isPublic.value ? 'public' : 'private'
      }
    })

    title.value = ''
    description.value = ''
    isPublic.value = false

    emit('close', true)
    toast.add({title: 'Calendar created', description: 'Your calendar is ready.'})
  } catch (e: any) {
    toast.add({
      title: 'Could not create calendar',
      description: e?.data?.message || e?.message || 'Unknown error',
      color: 'error'
    })
    emit('close', false)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UModal title="Calendar creation" description="Create a new calendar">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Title" for="cal-title">
          <UInput
              id="cal-title"
              v-model="title"
              placeholder="Engineering Releases, Team Events, etc."
              :ui="{ base: 'bg-white/5 border-white/10 text-white placeholder:text-white/40' }"
              autofocus
              class="w-full"
          />
        </UFormField>

        <UFormField label="Description" for="cal-description">
          <UTextarea
              id="cal-description"
              v-model="description"
              placeholder="What is this calendar for?"
              :rows="3"
              :ui="{ base: 'bg-white/5 border-white/10 text-white placeholder:text-white/40' }"
              class="w-full"
          />
        </UFormField>

        <div class="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 p-3">
          <div>
            <div class="text-sm font-medium text-white/90">Make public</div>
            <div class="text-xs text-white/60">Anyone with the link can view this calendar</div>
          </div>
          <USwitch v-model="isPublic" aria-label="Make calendar public"/>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <UButton
            :disabled="saving || !title.trim()"
            :loading="saving"
            class="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 w-full"
            @click="submit"
            block
            :label="saving ? 'Saving...' : 'Create Calendar'"
        />
      </div>
    </template>
  </UModal>
</template>
