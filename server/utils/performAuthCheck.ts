// server/utils/performAuthCheck.ts
import type { H3Event } from 'h3'
import { getCookie, createError } from 'h3'
import jwt from 'jsonwebtoken'
import prisma from '~~/lib/prisma'
import { useRuntimeConfig } from '#imports'

export default async function performAuthCheck(event: H3Event, errorCallback: (statusMessage: string) => never): Promise<string> {
    const { jwtSecret } = useRuntimeConfig()

    if (!jwtSecret) {
        console.error('JWT secret not set')
        errorCallback('server_error')
    }

    const token = getCookie(event, 'auth')
    if (!token) {
        errorCallback('unauthorized')
    }

    let payload: any
    try {
        payload = jwt.verify(token, jwtSecret)
    } catch (err) {
        console.error('JWT verification failed:', err)
        errorCallback('invalid_token')
    }

    if (typeof payload !== 'object' || !payload.sub || !payload.iat) {
        errorCallback('invalid_token')
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user || user.updatedAt.getTime() > payload.iat * 1000) {
        errorCallback('unauthorized')
    }

    return payload.sub as string
}
