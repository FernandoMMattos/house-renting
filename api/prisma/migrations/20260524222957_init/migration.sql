/*
  Warnings:

  - You are about to drop the column `Price` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `county` on the `Property` table. All the data in the column will be lost.
  - Added the required column `areaCode` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableFor` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableFrom` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sharingWith` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "Price",
DROP COLUMN "address",
DROP COLUMN "county",
ADD COLUMN     "areaCode" INTEGER NOT NULL,
ADD COLUMN     "availableFor" INTEGER NOT NULL,
ADD COLUMN     "availableFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "propertyType" TEXT NOT NULL,
ADD COLUMN     "sharingWith" INTEGER NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;
