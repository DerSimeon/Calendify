<script setup lang="ts">
import {ref} from 'vue'
import type {Calendar} from '~~/types'

const props = defineProps<{
  calendar: Calendar
  onChange: (updated: Calendar) => void
}>()
const runtimeConfig = useRuntimeConfig()
const url = runtimeConfig.public.backendUrl.split('/api')[0]

const copied = ref(false)
const isToggling = ref(false)


function handleCopy() {
  navigator.clipboard.writeText(url + props.calendar.slug).then(() => {
    copied.value = true
    //TODO: use a toast notification library
    setTimeout(() => {
      copied.value = false
    }, 1200)
  })
}

async function toggleVisibility(next: boolean) {
  isToggling.value = true;
  const current = props.calendar.visibility;
  if (next && current === 'PUBLIC') return;
  if (!next && current === 'PRIVATE') return;
  const response = await $fetch('/api/v1/calendar', {
    method: 'PUT',
    body: {
      id: props.calendar.id,
      visibility: next ? 'PUBLIC' : 'PRIVATE',
    },
  })
  if (response.statusCode === 200) {
    props.calendar.visibility = next ? 'PUBLIC' : 'PRIVATE';
    props.onChange(props.calendar);
    isToggling.value = false;
  }
}
</script>

<template>
  <UCard class="border-white/10 bg-white/5 text-white">
    <!-- header slot -->
    <template #header>
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-white/90 text-lg font-semibold">
            {{ props.calendar.name }}
          </h3>
          <UBadge
              :color="props.calendar.role === 'OWNER' ? 'success' : 'primary'"
              variant="subtle"
              class="border-white/20"
          >
            {{ props.calendar.role === 'OWNER' ? 'Owner' : 'Collaborator' }}
          </UBadge>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <div class="space-y-2">
        <label for="url" class="text-white/80 block text-sm font-medium">
          Calendar URL
        </label>
        <div class="flex gap-2">
          <UInput
              id="url"
              readonly
              :value="url + '/c/' + props.calendar.slug"
              class="bg-white/5 border-white/10 text-white placeholder:text-white/40 w-full rounded-md"
              color="neutral"
              variant="ghost"
          />
          <UButton
              variant="outline"
              color="neutral"
              class="bg-white/5 border-white/10 p-2"
              @click="handleCopy"
              :icon="copied ? 'i-heroicons-check-16-solid' : 'i-lucide-copy'"
          />
        </div>
      </div>

      <div
          class="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-black/5 p-3"
      >
        <div class="flex items-center gap-2">
          <UIcon :name="props.calendar.visibility === 'PUBLIC' ? 'i-heroicons-globe-alt-16-solid' : 'i-heroicons-lock-closed-16-solid'"
                 class="h-4 w-4"
                 :class="props.calendar.visibility === 'PUBLIC' ? 'text-emerald-300' : 'text-white/70'"/>
          <div>
            <div class="text-sm font-medium text-white/90">
              {{ props.calendar.visibility === 'PUBLIC' ? 'Public' : 'Private' }}
            </div>
            <div class="text-xs text-white/60">
              {{
                props.calendar.visibility === 'PUBLIC'
                    ? 'Anyone with the link can view'
                    : 'Only invited users can view'
              }}
            </div>
          </div>
        </div>
        <USwitch
            :model-value="props.calendar.visibility === 'PUBLIC'"
            :loading="isToggling"
            @update:modelValue="toggleVisibility"
            aria-label="Toggle calendar visibility"
            color="neutral"
        />
      </div>

      <!-- actions row -->
      <div class="flex items-center gap-2 flex-row">
        <UButton variant="outline" color="neutral" class="bg-white/5 border-white/10 text-white cursor-pointer"
                 leading-icon="i-heroicons-users-16-solid"
                 label="Users" block/>
        <UButton variant="outline" color="neutral" class=" bg-white/5 border-white/10 text-white font-normal cursor-pointer"
                 @click="navigateTo('/c/' + props.calendar.slug)"
                 leading-icon="i-heroicons-arrow-right" label="Open" block/>
      </div>
    </div>
  </UCard>
</template>
