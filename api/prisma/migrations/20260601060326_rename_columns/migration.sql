-- Rename availableFor to availableUntil on Property
ALTER TABLE "Property" RENAME COLUMN "availableFor" TO "availableUntil";

-- Rename houseId to propertyId on Image
ALTER TABLE "Image" RENAME COLUMN "houseId" TO "propertyId";