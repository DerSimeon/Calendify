<script lang="ts" setup>
const route = useRoute();
const error = route.query.error

const content = computed(() => {
  switch (error) {
    case "expired_token":
      return {
        title: "Magic link expired",
        description: "For your security, magic links are time‑limited. Request a new link to finish signing in.",
      };
    case "invalid_token":
      return {
        title: "Invalid magic link",
        description: "The magic link appears invalid, already used, or malformed. Request a fresh link to continue.",
      };
    case "unauthorized":
      return {
        title: "Unauthorized access",
        description: "You are not authorized to access this resource. Please log in or contact support.",
      };
    default:
      return {
        title: "Login error",
        description: "We couldn’t verify your magic link. Please try again.",
      };
  }
});

</script>

<template>
  <div class="min-h-[100dvh] bg-black text-white relative overflow-x-clip">
    <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(800px_800px_at_60%_10%,rgba(217,70,239,0.16),rgba(0,0,0,0)),radial-gradient(700px_600px_at_20%_80%,rgba(124,58,237,0.12),rgba(0,0,0,0))]"
    />
    <main class="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
      <div class="mx-auto max-w-lg">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-rose-500/15 border border-rose-400/20 flex items-center justify-center">
              <UIcon name="i-heroicons-exclamation-triangle-16-solid" class="h-5 w-5 text-rose-300"/>
            </div>
            <h1 class="text-xl md:text-2xl font-semibold">{{ content.title }}</h1>
          </div>
          <p class="text-white/70 mt-3">{{ content.description }}</p>

          <p class="text-xs text-white/50 mt-2">
            Error code: <span class="font-mono">{{ error }}</span>
          </p>

          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <UButton
                class="w-full bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 sm:flex-1"
                @click="navigateTo('/signup')" leading-icon="i-heroicons-envelope-open-16-solid"
                label="Request new link"/>
            <UButton variant="outline" class="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 sm:flex-1"
                     @click="navigateTo('/')" leading-icon="i-heroicons-home-16-solid" label="Back to home"/>
          </div>

          <div class="mt-6 text-xs text-white/60">
            If you continue to see this error, ensure you’re opening the exact link from your most recent email. Magic
            links can only be used once and expire after a short time.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>