-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_albumId_fkey";

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
