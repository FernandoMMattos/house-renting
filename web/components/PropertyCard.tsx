import { PropertyCard as PropertyCardType } from "@/types/property";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "https://placehold.co/400x300";

const PropertyCard = ({ property }: { property: PropertyCardType }) => {
  const coverPhoto = property.images?.[0]?.url ?? FALLBACK_IMAGE;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="flex flex-row sm:flex-col gap-0 bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image — left strip on mobile, full top on sm+ */}
      <div className="relative w-36 shrink-0 h-28 sm:w-full sm:h-44 overflow-hidden">
        <Image
          src={coverPhoto}
          alt={`${property.number} ${property.street}`}
          fill
          sizes="(max-width: 640px) 144px, 400px"
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center gap-1 p-3">
        <p className="font-bold text-base text-gray-900">
          €{property.price}
          <span className="font-normal text-sm text-gray-500">/mo</span>
        </p>
        <p className="font-medium text-sm text-gray-800 leading-snug">
          {property.number} {property.street}
        </p>
        <p className="text-xs text-gray-500">Dublin {property.areaCode}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {property.bedrooms} Bed · {property.bathrooms} Bath
          {property.sharingWith ? ` · Sharing with ${property.sharingWith}` : ""}
        </p>
      </div>
    </Link>
  );
};

export default PropertyCard;
