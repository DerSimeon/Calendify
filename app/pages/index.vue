<script lang="ts" setup>
import {motion} from 'motion-v'
const runtimeConfig = useRuntimeConfig()
const comingSoon = runtimeConfig.public.comingSoon || false

const featureCards = [
  {
    icon: 'i-heroicons-share-16-solid',
    title: 'Share with a link',
    desc:
        'Publish a public, read-only calendar. Share a single link and let viewers subscribe or embed it anywhere.'
  },
  {
    icon: 'i-heroicons-users-16-solid',
    title: 'Invite collaborators',
    desc:
        'Add teammates as managers with fine-grained permissions to co-create and maintain events together.'
  },
  {
    icon: 'i-heroicons-bolt-16-solid',
    title: 'Fast and delightful',
    desc:
        'Built for speed with keyboard shortcuts, smooth animations, and a responsive experience on any device.'
  }
]

const heroFeatures = [
  {icon: 'i-heroicons-share-16-solid', label: 'Shareable links'},
  {icon: 'i-heroicons-users-16-solid', label: 'Collaborative'},
  {icon: 'i-heroicons-shield-check-16-solid', label: 'Privacy controls'}
]

const heroListVariants = {
  hidden: {},
  show: {transition: {staggerChildren: 0.08}}
}

const heroItemVariants = {
  hidden: {opacity: 0, y: 8},
  show: {opacity: 1, y: 0}
}
</script>

<template>
  <div class="min-h-[100dvh] bg-black text-white relative overflow-x-clip">
    <AnimatedBackground/>

    <header class="relative z-10">
      <div class="mx-auto max-w-7xl px-4 md:px-6">
        <div class="h-16 md:h-20 flex items-center justify-between">
          <Link href="/" class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
              <UIcon name="i-heroicons-calendar-solid" class="h-5 w-5 text-fuchsia-300"/>
            </div>
            <span class="font-semibold tracking-tight">Calendify</span>
            <span class="sr-only">Calendify Home</span>
          </Link>
          <nav class="hidden md:flex items-center gap-6 text-sm text-white/80">
            <NuxtLink href="#features" class="hover:text-white transition-colors">
              Features
            </NuxtLink>
            <NuxtLink href="#screenshot" class="hover:text-white transition-colors">
              Screenshot
            </NuxtLink>
            <NuxtLink href="#opensource" class="hover:text-white transition-colors">
              Open Source
            </NuxtLink>
            <NuxtLink href="#cta" class="hover:text-white transition-colors">
              Get Started
            </NuxtLink>
          </nav>
          <div class="flex items-center gap-3">
            <NuxtLink href="https://github.com/dersimeon/calendify" target="_blank" class="hidden sm:inline-flex">
              <UButton variant="outline" class="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <UIcon name="i-simple-icons-github" class="mr-2 h-4 w-4"/>
                Star on GitHub
              </UButton>
            </NuxtLink>
            <UButton @click="navigateTo('/signup')"
                     class="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white border-0 hover:from-fuchsia-400 hover:to-violet-500"
            :label="comingSoon ? 'Coming Soon' : 'Sign Up'" :disabled="comingSoon as boolean"/>
          </div>
        </div>
      </div>
    </header>

    <main class="relative z-10">
      <SectionContainer class="pt-10 md:pt-16">
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div class="space-y-6">
            <motion.div
                :initial="{ opacity: 0, y: 16 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.6 }"
                :transition="{ duration: 0.6, ease: 'easeOut' }"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
            >
              <UIcon name="i-heroicons-sparkles-16-solid" class="h-3.5 w-3.5 text-fuchsia-300"/>
              <span>Free + Open Source</span>
            </motion.div>

            <motion.h1
                :initial="{ opacity: 0, y: 12 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.6 }"
                :transition="{ duration: 0.6, delay: 0.1, ease: 'easeOut' }"
                class="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]"
            >
              Own your calendar.
              <br/>
              Share it with the world.
            </motion.h1>

            <motion.p
                :initial="{ opacity: 0, y: 12 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.6 }"
                :transition="{ duration: 0.6, delay: 0.2, ease: 'easeOut' }"
                class="text-white/70 md:text-lg max-w-xl"
            >
              Calendify lets you create public calendars you control. Share a link for read-only viewing or invite
              collaborators to co-manage events. No paywalls. No limits.
            </motion.p>

            <motion.div
                :initial="{ opacity: 0, y: 12 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.6 }"
                :transition="{ duration: 0.6, delay: 0.3, ease: 'easeOut' }"
                class="flex flex-col sm:flex-row gap-3"
            >
              <UButton class="h-11 px-6 bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 text-white"
                       :label="comingSoon ? 'Coming Soon' : 'Get started free'"
                       @click="navigateTo('/signup')" :disabled="comingSoon as boolean" block/>
            </motion.div>

            <motion.ul
                initial="hidden"
                while-in-view="show"
                :viewport="{ once: true, amount: 0.6 }"
                :variants="heroListVariants"
                class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4"
            >
              <motion.li
                  v-for="(feat, i) in heroFeatures"
                  :key="i"
                  :variants="heroItemVariants"
                  class="flex items-center gap-2 text-white/80"
              >
                <UIcon :name="feat.icon" class="h-4 w-4 text-fuchsia-300"/>
                <span class="text-sm">{{ feat.label }}</span>
              </motion.li>
            </motion.ul>
          </div>

          <motion.div
              :initial="{ opacity: 0, y: 16, scale: 0.98 }"
              :while-in-view="{ opacity: 1, y: 0, scale: 1 }"
              :viewport="{ once: true, amount: 0.4 }"
              :transition="{ duration: 0.7, ease: 'easeOut' }"
              class="relative"
          >
            <div
                class="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-r from-fuchsia-600/20 to-violet-700/20 rounded-3xl"/>
            <NuxtImg
                src="/images/calendify-screenshot-dark.png"
                alt="Calendify calendar with sample appointments"
                width="1280"
                height="800"
                class="w-full h-auto rounded-xl border border-white/10 shadow-2xl shadow-fuchsia-900/20"
            />
            <div class="absolute -top-3 -left-3">
              <UBadge class="bg-fuchsia-600/20 text-fuchsia-200 border border-fuchsia-400/30">
                Demo
              </UBadge>
            </div>
          </motion.div>
        </div>
      </SectionContainer>

      <SectionContainer class="border-t border-white/10" id="features">
        <div class="grid lg:grid-cols-3 gap-6 md:gap-8">
          <motion.div
              v-for="(card, i) in featureCards"
              :key="i"
              :initial="{ opacity: 0, y: 16 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.5 }"
              :transition="{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }"
              class="rounded-xl border border-white/10 bg-white/5 p-6"
          >
            <div class="h-10 w-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center mb-4">
              <UIcon :name="card.icon" class="h-5 w-5 text-fuchsia-300"/>
            </div>
            <h3 class="text-lg font-semibold">{{ card.title }}</h3>
            <p class="text-sm text-white/70 mt-2">{{ card.desc }}</p>
          </motion.div>
        </div>
      </SectionContainer>

      <SectionContainer class="bg-gradient-to-b from-transparent to-fuchsia-900/10" id="screenshot">
        <!-- <ScreenshotShowcase/> -->
      </SectionContainer>

      <SectionContainer class="border-t border-white/10" id="opensource">
        <div class="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
              :initial="{ opacity: 0, y: 16 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.5 }"
              :transition="{ duration: 0.6, ease: 'easeOut' }"
              class="space-y-4"
          >
            <h2 class="text-3xl md:text-4xl font-bold">Free and Open Source</h2>
            <p class="text-white/70">
              Calendify is completely free and open source. Dive into the code, file issues, and contribute features.
              Your feedback and pull requests help shape the roadmap.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <NuxtLink to="https://github.com/dersimeon/calendify" target="_blank">
                <UButton variant="outline" class="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <UIcon name="i-simple-icons-github" class="mr-2 h-4 w-4"/>
                  View Repository
                </UButton>
              </NuxtLink>
              <UButton class="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white"
                       :label="comingSoon ? 'Coming Soon' : 'Start now'"
                       @click="navigateTo('/signup')" :disabled="comingSoon as boolean"/>
            </div>
          </motion.div>

          <motion.div
              :initial="{ opacity: 0, y: 16 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.5 }"
              :transition="{ duration: 0.6, ease: 'easeOut' }"
              class="rounded-xl border border-white/10 bg-white/5 p-6"
          >
          <pre class="text-xs md:text-sm text-white/80 overflow-auto whitespace-pre-wrap ">
              # Clone and run
              git clone https://github.com/dersimeon/calendify
              cd calendify
              bun install
              bun run dev
          </pre>
          </motion.div>
        </div>
      </SectionContainer>

      <SectionContainer class="border-t border-white/10" id="cta">
        <motion.div
            :initial="{ opacity: 0, y: 16 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :viewport="{ once: true, amount: 0.5 }"
            :transition="{ duration: 0.6, ease: 'easeOut' }"
            class="rounded-2xl border border-white/10 bg-gradient-to-r from-fuchsia-600/15 to-violet-700/15 p-8 md:p-12"
        >
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <h3 class="text-2xl md:text-3xl font-semibold">Create your first public calendar</h3>
              <p class="text-white/70">
                Sign up with your email and we’ll send a magic link. No passwords, no hassle.
              </p>
            </div>
            <UButton to="/signup"
                     class="h-11 px-6 bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500"
            :label="comingSoon ? 'Coming Soon' : 'Get Started'" :disabled="comingSoon as boolean"/>
          </div>
        </motion.div>
      </SectionContainer>
    </main>

    <footer class="relative z-10 border-t border-white/10">
      <div class="mx-auto max-w-7xl px-4 md:px-6 py-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <p class="text-xs text-white/60">
          ©
          {{ new Date().getFullYear() }} Calendify. Free and Open Source.
          <span class="text-white/80">Made with </span>
          <UIcon name="i-heroicons-heart-16-solid" class="t-4 h-4 w-4 text-red-500"/>
          <span class="text-white/80"> by Simeon</span>
        </p>
        <nav class="flex items-center gap-4 text-sm" aria-label="Footer navigation">
          <ULink
              href="https://github.com/dersimeon/calendify"
              target="_blank"
              class="text-white/80 hover:text-white flex items-center gap-2"
          >
            <UIcon name="i-simple-icons-github" class="h-4 w-4"/>
            GitHub
          </ULink>
          <ULink href="#features" class="text-white/80 hover:text-white">
            Features
          </ULink>
          <ULink href="#opensource" class="text-white/80 hover:text-white">
            Contribute
          </ULink>
          <ULink v-if="!comingSoon" :disabled="comingSoon as boolean" href="/signup" class="text-white/80 hover:text-white">
            Sign up
          </ULink>
        </nav>
      </div>
    </footer>
  </div>
</template>