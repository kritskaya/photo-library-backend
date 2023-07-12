/*
  Warnings:

  - You are about to drop the column `collcetionId` on the `albums` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "albums" DROP CONSTRAINT "albums_collcetionId_fkey";

-- AlterTable
ALTER TABLE "albums" DROP COLUMN "collcetionId",
ADD COLUMN     "collectionId" INTEGER;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
