-- AlterTable
ALTER TABLE "public"."Calendar" ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'private';

-- AlterTable
ALTER TABLE "public"."LoginAttempt" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '15 minutes');
