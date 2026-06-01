"use client";

import { getProperties } from "@/lib/property";
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { Property } from "@/types/property";

const RecentAdded = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProperties()
      .then(setProperties)
      .catch(() => setError("Failed to load properties"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-20 flex flex-col">
      <p className="font-bold text-2xl my-10">Recently added properties</p>
      {error ? <p className="text-red-500 mx-20">{error}</p> : ""}
      {loading ? (
        <p className="text-gray-400 mx-20">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-gray-400">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentAdded;
