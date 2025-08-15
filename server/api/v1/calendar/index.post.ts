import prisma from "~~/lib/prisma";
import {nanoid} from "nanoid";
import {Visibility} from "@prisma/client";

export default defineEventHandler(async (event) => {
    const auth = await performAuthCheck(event)

    if ('statusCode' in auth) {
        return sendRedirect(
            event,
            `/auth/error?error=${encodeURIComponent(auth.body.statusMessage)}`
        )
    }

    const body = await readBody(event);
    const {title, description, visibility} = body;
    const id = nanoid(10);

    if (!title || !visibility) {
        return {
            statusCode: 500,
            body: {
                error: 'Missing required fields'
            }
        }
    }

    const validVisibilities = Object.values(Visibility);
    if (!validVisibilities.includes((visibility as string).toUpperCase() as Visibility)) {
        return {
            statusCode: 400,
            body: {
                error: 'Invalid visibility value'
            }
        }
    }

    const visibilityEnum = (visibility as string).toUpperCase() as Visibility;

    const result = await prisma.calendar.create({
        data: {
            name: title,
            description: description || '',
            slug: id,
            visibility: visibilityEnum,
        }
    })

    await prisma.calendarUser.create({
        data: {
            userId: auth.userId,
            calendarId: result.id,
            role: 'OWNER',
        }
    })
})