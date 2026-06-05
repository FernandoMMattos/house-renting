"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertyGallery from "@/components/PropertyGallery";
import { getProperty } from "@/lib/property";
import { Property } from "@/types/property";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
});

const FALLBACK = "https://placehold.co/800x500";

const PropertyPage = () => {
  const { id } = useParams();
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProperty(id as string)
      .then(setProperty)
      .catch(() => setError("Failed to load property"))
      .finally(() => setLoading(false));
  }, [id]);

  const photos = property?.images?.length
    ? property.images
    : [{ url: FALLBACK, publicId: "" }];

  if (loading) return <p className="mx-20 my-10 text-gray-400">Loading...</p>;
  if (error)
    return (
      <>
        <Header />
        <p className="mx-20 my-10 text-red-500">{error}</p>
        <Footer />
      </>
    );
  if (!property) return null;

  return (
    <>
      <Header />
      <main className="mx-20 my-10 flex flex-col gap-6">
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
          {user && <p className="text-gray-500">{property.author.email}</p>}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PropertyPage;
