/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,resourceId]` on the table `ReadPost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ReadPost" DROP CONSTRAINT "ReadPost_userEmail_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "ReadPost_userEmail_resourceId_key" ON "ReadPost"("userEmail", "resourceId");
