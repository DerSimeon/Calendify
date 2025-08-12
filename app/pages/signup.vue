<script lang="ts" setup>
import * as z from 'zod'
import type {FormErrorEvent, FormSubmitEvent} from "@nuxt/ui";
import {motion} from "motion-v";

const schema = z.object({
  email: z.email({ pattern: z.regexes.html5Email }),
})
const errorMessage = ref<string | null>(null)
const success = ref(false)
definePageMeta({
  middleware: 'guest-only'
})
type Schema = z.output<typeof schema>
const runtimeConfig = useRuntimeConfig()
const comingSoon = runtimeConfig.public.comingSoon || false

const state = reactive<Partial<Schema>>({
  email: '',
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const response = await $fetch('/api/v1/auth/register', {
    method: 'POST',
    body: {
      email: event.data.email,
    }
  })

  if (response.statusCode === 200) {
    state.email = ''
    success.value = true
  } else {
    errorMessage.value = response.body.message || 'An error occurred while sending the magic link.'
  }
}

async function onError(event: FormErrorEvent) {
  if (event?.errors.length > 0 && event.errors[0]) {
    errorMessage.value = event.errors[0].message || 'An error occurred while processing your request.'
  }
}

onMounted(() => {
  if (comingSoon) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="min-h-[100dvh] bg-black text-white relative overflow-hidden">
    <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(600px_600px_at_60%_10%,rgba(217,70,239,0.18),rgba(0,0,0,0)),radial-gradient(800px_600px_at_20%_80%,rgba(124,58,237,0.14),rgba(0,0,0,0))]"
    />
    <div class="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div class="mx-auto max-w-md">
        <div class="mb-8 flex items-center justify-between">
          <NuxtLink to="/" class="text-white/70 hover:text-white text-sm">
            ← Back
          </NuxtLink>
          <UButton leading-icon="i-simple-icons-github" variant="ghost"
                   class="text-white/70 hover:text-white cursor-pointer"
                   @click="navigateTo('https://github.com/dersimeon/calendify')" label="GitHub"/>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h1 class="text-2xl md:text-3xl font-semibold">
            Sign up with a magic link
          </h1>
          <p class="text-white/70 mt-2">
            Enter your email and we’ll send you a secure sign-in link. No passwords
            needed.
          </p>

          <UForm :schema="schema" :state="state" @submit="onSubmit" @error="onError" class="mt-6 space-y-4" v-if="!success">
            <div class="space-y-2">
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <UFormField>
                    <UInput leading-icon="i-heroicons-envelope-open-16-solid" variant="ghost"
                            placeholder="you@calendify.one"
                            v-model="state.email"
                            class="bg-white/5 border border-white/10 text-white placeholder:text-white/40 w-full rounded"/>
                  </UFormField>
                </div>
                <UButton
                    leading-icon="i-heroicons-arrow-right-16-solid"
                    type="submit"
                    loading-auto
                    class="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 min-w-28 py-2 px-4 rounded cursor-pointer"
                    label="Send Link"
                />
              </div>
            </div>
          </UForm>

          <motion.div
              v-if="success"
              :initial="{ opacity: 0, y: 20, scale: 0.8 }"
              :animate="{ opacity: 1, y: 0, scale: 1 }"
              :transition="{ type: 'spring', stiffness: 200, damping: 20 }"
              class="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-lg font-semibold"
          >
            🎉 Let’s Plan! We’ve sent you a magic link to log in. High five! 🙌
          </motion.div>

          <div v-if="errorMessage" class="mt-4 text-sm text-rose-300">
            {{ errorMessage }}
          </div>

          <div class="mt-6 text-xs text-white/60">
            By continuing, you agree to our
            <span class="underline underline-offset-2 decoration-white/30">Terms</span>
            and
            <span class="underline underline-offset-2 decoration-white/30"
            >Privacy Policy</span
            >.
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between text-sm text-white/70">
          <span>Already have a link? Click it from your email.</span>
          <NuxtLink to="/" class="inline-flex items-center gap-1 hover:text-white">
            Explore Calendify
            <UIcon name="i-heroicons-arrow-right-16-solid" class="h-3.5 w-3.5"/>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>