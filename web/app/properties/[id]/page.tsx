import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertyGallery from "@/components/PropertyGallery";
import { getPropertyServer } from "@/lib/property";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PropertyMap from "@/components/PropertyMapLazy";

const FALLBACK = "https://placehold.co/800x500";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyServer(id).catch(() => null);
  if (!property) return { title: "Property not found" };
  return {
    title: `${property.number} ${property.street} — Dublin ${property.areaCode} | House Renting Dublin`,
    description: property.description.slice(0, 160),
  };
}

const PropertyPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const property = await getPropertyServer(id).catch(() => null);

  if (!property) notFound();

  const photos = property.images?.length
    ? property.images
    : [{ url: FALLBACK, publicId: "" }];

  return (
    <>
      <Header />
      <main className="mx-4 md:mx-20 my-6 md:my-10 flex flex-col gap-6 pb-20 md:pb-0">
        <PropertyGallery
          photos={photos}
          number={property.number}
          street={property.street}
        />

        <h1 className="text-3xl font-bold">
          {property.number} {property.street} - Dublin {property.areaCode}
        </h1>

        <section className="flex flex-col gap-2">
          <p className="text-2xl font-bold">€{property.price} / month</p>
          <p className="text-gray-400">{property.eirCode}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Details</h2>
          <p>
            {property.bedrooms} Bedrooms · {property.bathrooms} Bathrooms
          </p>
          <p>
            Type: {property.propertyType.toLocaleLowerCase()} ·{" "}
            {property.roomType.toLocaleLowerCase()} room
          </p>
          {property.sharingWith > 0 && (
            <p>Sharing with {property.sharingWith} people</p>
          )}
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-gray-700">{property.description}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Availability</h2>
          <p>
            Available from:{" "}
            {new Date(property.availableFrom).toLocaleDateString()}
          </p>
          <p>
            Available until:{" "}
            {new Date(property.availableUntil).toLocaleDateString()}
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Location</h2>
          <PropertyMap
            street={property.street}
            areaCode={property.areaCode}
            number={property.number}
          />
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Listed by</h2>
          <p>{property.author.name}</p>
          <p className="text-gray-500">{property.author.email}</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PropertyPage;
