import prisma from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
    const userId = await performAuthCheck(event, (error) => {
        return sendRedirect(event, '/auth/error?error=' + error)
    });
    const body = await readBody(event);
    const {id, visibility} = body;

    if (!id || !visibility) {
        return {
            statusCode: 500,
            body: {
                error: 'Missing required fields'
            }
        }
    }

    const calendar = await prisma.calendar.findUnique({
        where: {
            id: id
        },
        include: {
            CalendarUser: true
        }
    })

    if (!calendar) {
        return {
            statusCode: 404,
            body: {
                error: 'Calendar not found'
            }
        }
    }

    const calendarUser = calendar.CalendarUser.find(user => user.userId === userId);
    if (!calendarUser) {
        return {
            statusCode: 403,
            body: {
                error: 'You do not have permission to update this calendar'
            }
        }
    }

    await prisma.calendar.update({
        where: {
            id: id
        },
        data: {
            visibility: (visibility as string).toUpperCase()
        }
    })

    return {
        statusCode: 200,
        body: {}
    }


})