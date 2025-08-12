export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return

    const response = await $fetch<{statusCode: number, body: {error: string}}>('/api/v1/auth/me')
    if (response.statusCode == 200){
            return navigateTo('/dashboard')
    }
})