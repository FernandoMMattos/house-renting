"use client";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilterPanel from "@/components/PropertyFilterPanel";
import usePropertyFilters from "@/hooks/usePropertyFilters";
import { getProperties } from "@/lib/property";
import { Property } from "@/types/property";
import { useEffect, useState } from "react";

import { Suspense } from "react";

const PropertiesContent = () => {
  const { filters, handleChange, handleClear } = usePropertyFilters();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getProperties(filters)
      .then((response) => setProperties(response.data))
      .catch(() => setError("Failed to load properties"))
      .finally(() => setLoading(false));
  }, [filters]);

  const activeLabel =
    filters.areaCodes.length > 0
      ? `Dublin ${filters.areaCodes.sort((a, b) => Number(a) - Number(b)).join(", ")}`
      : "All";

  return (
    <>
      <Header />
      <main className="mx-20 flex flex-row gap-8 my-10 items-start">
        <PropertyFilterPanel
          values={filters}
          onChange={handleChange}
          onClear={handleClear}
        />
        <div className="flex-1 flex flex-col gap-6">
          <p className="font-bold text-2xl">Properties · {activeLabel}</p>
          {loading && <p className="text-gray-400">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && properties.length === 0 && (
            <p className="text-gray-400">No properties found.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

const PropertiesPage = () => (
  <Suspense>
    <PropertiesContent />
  </Suspense>
);

export default PropertiesPage;
