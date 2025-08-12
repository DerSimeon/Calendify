// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit';

const resolver = createResolver(import.meta.url);

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxt/ui', 'motion-v/nuxt', '@nuxt/image', "nuxt-nodemailer", 'nuxt-api-shield'],
    css: ['~/assets/css/main.css'],
    nodemailer: {
        from: '"Calendify No-Reply" <no-reply@calendify.one>',
        host: 'mail.spacemail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'no-reply@calendify.one',
            pass: ''
        }
    },
    runtimeConfig: {
        public: {
            backendUrl: 'http://localhost:3000/api/v1/',
            comingSoon: '',
        },
        jwtSecret: ''
    },
    nuxtApiShield: {
        limit: {
            max: 10,
            duration: 60,
            ban: 3600
        },
        errorMessage: 'Too many requests, please try again later.',
        retryAfterHeader: true,
        routes: ['/api/v1/auth/'],
    },
    nitro: {
        storage: {
            shield: {
                driver: 'memory'
            }
        },
        experimental: {
            tasks: true
        },
        scheduledTasks: {
            "*/15 * * * *": ["shield:clean"]
        }
    },
})