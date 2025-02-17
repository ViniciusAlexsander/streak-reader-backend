/*
  Warnings:

  - You are about to drop the column `userId` on the `ReadPost` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `ReadPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReadPost" DROP CONSTRAINT "ReadPost_userId_fkey";

-- AlterTable
ALTER TABLE "ReadPost" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ReadPost" ADD CONSTRAINT "ReadPost_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
