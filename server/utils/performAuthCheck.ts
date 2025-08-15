// server/utils/performAuthCheck.ts
import type {H3Event} from 'h3'
import {getCookie} from 'h3'
import jwt from 'jsonwebtoken'
import prisma from '~~/lib/prisma'
import {useRuntimeConfig} from '#imports'

export type AuthSuccess = { userId: string }
export type AuthFailure = { statusCode: number; body: { statusMessage: string } }
export type AuthResult = AuthSuccess | AuthFailure

export default async function performAuthCheck(
    event: H3Event,
    allowUnauthenticated: boolean = false
): Promise<AuthResult> {
    const {jwtSecret} = useRuntimeConfig()

    if (!jwtSecret) {
        console.error('JWT secret not set')
        return {statusCode: 500, body: {statusMessage: 'server_error'}}
    }

    const token = getCookie(event, 'auth')
    if (!token && !allowUnauthenticated) {
        return {statusCode: 401, body: {statusMessage: 'unauthorized'}}
    }

    let payload: any
    try {
        payload = jwt.verify(token, jwtSecret)
    } catch (err) {
        if (!allowUnauthenticated)
            return {statusCode: 401, body: {statusMessage: 'invalid_token'}}
    }

    if (
        (typeof payload !== 'object' ||
        payload === null ||
        typeof payload.sub !== 'string' ||
        typeof payload.iat !== 'number') && !allowUnauthenticated
    ) {
        return {statusCode: 401, body: {statusMessage: 'invalid_token'}}
    }

    if(!payload && allowUnauthenticated) {
        return {userId: ''}
    }

    const user = await prisma.user.findUnique({where: {id: payload.sub}})
    if ((!user || user.updatedAt.getTime() > payload.iat * 1000) && !allowUnauthenticated) {
        return {statusCode: 401, body: {statusMessage: 'unauthorized'}}
    }

    return {userId: payload.sub}
}
