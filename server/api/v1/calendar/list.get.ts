import prisma from "~~/lib/prisma";
import {flattenPrismaIncludeResult} from "~~/lib/prismaFlatten";

export default defineEventHandler(async (event) => {
    const auth = await performAuthCheck(event);
    if ('statusCode' in auth) {
        return sendRedirect(
            event,
            `/auth/error?error=${encodeURIComponent(auth.body.statusMessage)}`
        )
    }
    const filter = {
        select: {
            calendar: {
                include: {
                    CalendarUser: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const calendarList = await prisma.calendarUser.findMany({
        where: {userId: auth.userId},
        ...filter
    })

    const finalCalendar = calendarList.map((cal) => {
        const calendar = cal.calendar;
        if (!calendar) return null; // skip if no calendar found
        const userRole = cal.calendar.CalendarUser.find(cu => cu.user.id === auth.userId)?.role;
        return {
            role: userRole,
            ...calendar,
        };
    })

    return {
        statusCode: 200,
        body: flattenPrismaIncludeResult(finalCalendar, filter.select)
    }
})