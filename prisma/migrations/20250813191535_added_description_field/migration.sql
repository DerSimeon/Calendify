-- AlterTable
ALTER TABLE "public"."Calendar" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."LoginAttempt" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '15 minutes');
