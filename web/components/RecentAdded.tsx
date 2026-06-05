import { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";

const RecentAdded = async () => {
  let properties: Property[] = [];

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
    const res = await fetch(`${baseUrl}/properties`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      properties = data.data ?? [];
    }
  } catch {
    // render empty state on error
  }

  return (
    <section className="mx-20 flex flex-col">
      <p className="font-bold text-2xl my-10">Recently added properties</p>
      {properties.length === 0 ? (
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
