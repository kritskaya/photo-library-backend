-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_photoId_fkey";

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
