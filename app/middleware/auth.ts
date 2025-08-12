export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return

    const response = await $fetch<{statusCode: number, body: {statusMessage: string}}>('/api/v1/auth/me')
    if (response.statusCode != 200){
        if (to.path !== '/auth/error') {
            return navigateTo('/auth/error?error=' + response.body.statusMessage)
        }
    }
})