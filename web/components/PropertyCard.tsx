import { PropertyCard as PropertyCardType } from "@/types/property";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "https://placehold.co/222x150";

const PropertyCard = ({ property }: { property: PropertyCardType }) => {
  const coverPhoto = property.images?.[0]?.url ?? FALLBACK_IMAGE;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="flex flex-col gap-2"
    >
      <div className="relative h-37.5 w-55.5 overflow-hidden rounded-sm">
        <Image
          src={coverPhoto}
          alt={`${property.number} ${property.street}`}
          fill
          sizes="222px"
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>

      <p className="font-semibold">
        {property.number} {property.street} - Dublin {property.areaCode}
      </p>
      <p className="font-bold">€{property.price}</p>
      <p className="text-sm text-gray-500">
        {property.bedrooms} Bed · {property.bathrooms} Bath{" "}
        {property.sharingWith ? `· Sharing with ${property.sharingWith}` : ""}
      </p>
    </Link>
  );
};

export default PropertyCard;
