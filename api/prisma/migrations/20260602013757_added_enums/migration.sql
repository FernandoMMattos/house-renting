/*
  Warnings:

  - You are about to alter the column `price` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - Changed the type of `roomType` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `propertyType` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'APARTMENT', 'FLAT', 'STUDIO');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'SHARED');

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_authorId_fkey";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "roomType",
ADD COLUMN     "roomType" "RoomType" NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "areaCode" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "propertyType",
ADD COLUMN     "propertyType" "PropertyType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
