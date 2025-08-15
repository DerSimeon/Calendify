import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const auth = await performAuthCheck(event);
    if ('statusCode' in auth) {
        return sendRedirect(
            event,
            `/auth/error?error=${encodeURIComponent(auth.body.statusMessage)}`
        );
    }

    const body = await readBody(event);
    const { id } = body;

    if (!id) {
        return {
            statusCode: 400,
            body: {
                error: 'Missing required fields'
            }
        };
    }

    const calendar = await prisma.calendar.findUnique({
        where: { id },
        include: { CalendarUser: true }
    });

    if (!calendar) {
        return {
            statusCode: 404,
            body: {
                error: 'Calendar not found'
            }
        };
    }

    const calendarUser = calendar.CalendarUser.find(user => user.userId === auth.userId);
    if (!calendarUser) {
        return {
            statusCode: 403,
            body: {
                error: 'You do not have permission to delete this calendar'
            }
        };
    }

    await prisma.calendar.delete({
        where: { id },
    });

    return {
        statusCode: 200,
        body: { message: 'Calendar deleted successfully' }
    };
})