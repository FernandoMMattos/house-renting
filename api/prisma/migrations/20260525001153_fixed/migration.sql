/*
  Warnings:

  - Added the required column `authorId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `availableFor` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_id_fkey";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "authorId" TEXT NOT NULL,
DROP COLUMN "availableFor",
ADD COLUMN     "availableFor" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
