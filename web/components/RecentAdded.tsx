import { getPropertiesServer } from "@/lib/property";
import PropertyCard from "./PropertyCard";

const RecentAdded = async () => {
  const properties = await getPropertiesServer();

  return (
    <section className="mx-4 md:mx-20 flex flex-col">
      <p className="font-bold text-xl md:text-2xl my-6 md:my-10">Recently added properties</p>
      {properties.length === 0 ? (
        <p className="text-gray-400">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentAdded;
