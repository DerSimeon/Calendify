import template from '~/assets/template.html';
import {nanoid} from "nanoid";
import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const runtimeConfig = useRuntimeConfig();
    const {email} = body;
    const year = new Date().getFullYear();
    const magicToken = nanoid(32);
    const magicUrl = `${runtimeConfig.public.backendUrl}auth/magic?token=${magicToken}`;
    const mailer = useNodeMailer()

    const user = await prisma.user.upsert({
        where: {email},
        update: {},
        create: {
            email,
            name: email
        }
    })

    await prisma.loginAttempt.create({
        data: {
            token: magicToken,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    await prisma.auditLog.create({
        data: {
            user: {
                connect: {
                    id: user.id
                }
            },
            event: 'login_attempt'
        }
    })

    const cleanUrl = runtimeConfig.public.backendUrl.replace(/\/$/, '')

    const finalTemplate = template
        .replace(/{{YEAR}}/g, year.toString())
        .replace(/{{MAGIC_LINK}}/g, magicUrl)
        .replace(/{{EMAIL}}/g, email)
        .replace(/{{EXPIRES_IN_MINUTES}}/g, '15')
        .replace(/{{APP_URL}}/g, cleanUrl)


    const result = await mailer.sendMail({
        to: email,
        subject: 'Calendify Magic Login',
        html: finalTemplate
    })

    if (!result.accepted.includes(email)) {
        return {
            statusCode: 500,
            body: {
                message: 'Failed to send email'
            }
        }
    }

    return {
        statusCode: 200,
        body: {
            message: 'Magic link sent successfully',
        }
    };
})