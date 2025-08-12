import prisma from "~~/lib/prisma";
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const {token} = getQuery(event)
    const runtimeConfig = useRuntimeConfig();
    const jwtSecret = runtimeConfig.jwtSecret;
    if (!jwtSecret) {
        console.error('JWT secret is not set in runtime config');
        return sendRedirect(event, '/auth/error?error=server_error');
    }
    if (!token || typeof token !== 'string') {
        return sendRedirect(event, '/auth/error?error=invalid_token')
    }
    const attempt = await prisma.loginAttempt.findUnique({where: {token}})

    if (!attempt || attempt.used || Date.now() > +attempt.expiresAt) {
        return sendRedirect(event, '/auth/error?error=expired_token')
    }

    await prisma.loginAttempt.update({
        where: {token},
        data: {used: true, usedAt: new Date()}
    })

    const jwtToken = jwt.sign({}, jwtSecret, {
        algorithm: 'HS256',
        expiresIn: '24h',
        issuer: 'calendify.one',
        subject: attempt.userId
    })
    setCookie(event, 'auth', jwtToken, {httpOnly: true, secure: true, path: '/'})

    return sendRedirect(event, '/dashboard')

})