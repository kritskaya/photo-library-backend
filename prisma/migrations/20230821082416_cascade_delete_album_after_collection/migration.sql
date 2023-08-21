-- DropForeignKey
ALTER TABLE "albums" DROP CONSTRAINT "albums_collectionId_fkey";

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
