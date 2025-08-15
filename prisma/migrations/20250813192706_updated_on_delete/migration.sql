-- DropForeignKey
ALTER TABLE "public"."CalendarEvent" DROP CONSTRAINT "CalendarEvent_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CalendarUser" DROP CONSTRAINT "CalendarUser_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CalendarUser" DROP CONSTRAINT "CalendarUser_userId_fkey";

-- AlterTable
ALTER TABLE "public"."LoginAttempt" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '15 minutes');

-- AddForeignKey
ALTER TABLE "public"."CalendarUser" ADD CONSTRAINT "CalendarUser_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "public"."Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarUser" ADD CONSTRAINT "CalendarUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarEvent" ADD CONSTRAINT "CalendarEvent_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "public"."Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
