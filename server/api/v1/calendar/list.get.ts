import prisma from "~~/lib/prisma";
import {flattenPrismaIncludeResult} from "~~/lib/prismaFlatten";

export default defineEventHandler(async (event) => {
    const userId = await performAuthCheck(event, (error) => {
        return sendRedirect(event, '/auth/error?error=' + error)
    });
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
        where: {userId: userId},
        ...filter
    })

    const finalCalendar = calendarList.map((cal) => {
        const calendar = cal.calendar;
        if (!calendar) return null; // skip if no calendar found
        const userRole = cal.calendar.CalendarUser.find(cu => cu.user.id === userId)?.role;
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