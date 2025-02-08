/*
  Warnings:

  - You are about to drop the column `major` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "major",
ADD COLUMN     "majorId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE SET NULL ON UPDATE CASCADE;
