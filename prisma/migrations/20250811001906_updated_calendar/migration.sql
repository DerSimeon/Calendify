/*
  Warnings:

  - You are about to drop the column `userId` on the `Calendar` table. All the data in the column will be lost.
  - The `visibility` column on the `Calendar` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Calendar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "public"."Calendar" DROP COLUMN "userId",
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "visibility",
ADD COLUMN     "visibility" "public"."Visibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "public"."LoginAttempt" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '15 minutes');

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_slug_key" ON "public"."Calendar"("slug");
