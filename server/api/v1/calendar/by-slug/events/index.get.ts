import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const auth = await performAuthCheck(event, true);
    if ('statusCode' in auth) {
        return sendRedirect(
            event,
            `/auth/error?error=${encodeURIComponent(auth.body.statusMessage)}`
        );
    }

    const { slug } = getRouterParams(event);

    if (!slug) {
        return {
            statusCode: 400,
            body: {
                error: 'Missing required fields'
            }
        };
    }

    const calendar = await prisma.calendar.findUnique({
        where: { slug },
        include: { CalendarEvent: true, CalendarUser:true }
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
    if (!calendarUser && calendar.visibility !== 'PUBLIC') {
        return {
            statusCode: 403,
            body: {
                error: 'You do not have permission to access this calendar'
            }
        };
    }

    return {
        statusCode: 200,
        body: calendar.CalendarEvent
    };
})