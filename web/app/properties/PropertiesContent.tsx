"use client";

import PropertyCard from "@/components/PropertyCard";
import PropertyFilterPanel from "@/components/PropertyFilterPanel";
import usePropertyFilters from "@/hooks/usePropertyFilters";
import { Property } from "@/types/property";
import { useState } from "react";
import { FaSlidersH } from "react-icons/fa";

interface Props {
  properties: Property[];
}

const PropertiesContent = ({ properties }: Props) => {
  const { filters, handleChange, handleClear } = usePropertyFilters();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeLabel =
    filters.areaCodes.length > 0
      ? `Dublin ${filters.areaCodes.sort((a, b) => Number(a) - Number(b)).join(", ")}`
      : "All";

  const activeCount = [
    filters.areaCodes.length > 0,
    !!filters.roomType,
    !!filters.propertyType,
    !!filters.minPrice,
    !!filters.maxPrice,
    !!filters.bedrooms,
    !!filters.bathrooms,
    !!filters.sharingWith,
  ].filter(Boolean).length;

  return (
    <main className="mx-4 md:mx-20 flex flex-col md:flex-row gap-4 md:gap-8 my-6 md:my-10 items-start">
      <div className="flex items-center gap-3 md:hidden w-full">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <FaSlidersH className="text-gray-500" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-gray-900 px-1.5 py-0.5 text-xs font-medium text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <PropertyFilterPanel
        values={filters}
        onChange={handleChange}
        onClear={handleClear}
        mobileOpen={mobileFiltersOpen}
        onMobileClose={() => setMobileFiltersOpen(false)}
      />

      <div className="flex-1 flex flex-col gap-4 md:gap-6 w-full">
        <p className="font-bold text-xl md:text-2xl">
          Properties · {activeLabel}
        </p>
        {properties.length === 0 ? (
          <p className="text-gray-400">No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default PropertiesContent;
