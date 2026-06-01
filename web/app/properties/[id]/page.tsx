"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getProperty } from "@/lib/property";
import { Property } from "@/types/property";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
});

const FALLBACK = "https://placehold.co/800x500";

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getProperty(id as string)
      .then(setProperty)
      .catch(() => setError("Failed to load property"))
      .finally(() => setLoading(false));
  }, [id]);

  const photos = property?.image?.length
    ? property.image
    : [{ url: FALLBACK, publicId: "" }];

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prev, next]);

  if (loading) return <p className="mx-20 my-10 text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!property) return null;

  return (
    <>
      <Header />
      <main className="mx-20 my-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-120 rounded-xl overflow-hidden">
            <button
              type="button"
              className="relative col-span-2 row-span-2 w-full h-full"
              onClick={() => {
                setActiveIndex(0);
                setLightboxOpen(true);
              }}
            >
              <Image
                src={photos[0].url}
                alt={`${property.number} ${property.street} — photo 1`}
                fill
                priority
                sizes="50vw"
                quality={100}
                style={{ objectFit: "cover" }}
                loading="eager"
              />
            </button>

            {photos.slice(1, 5).map((photo, i) => {
              const isLast = i === 3 && photos.length > 5;
              return (
                <button
                  key={photo.publicId || i}
                  type="button"
                  className="relative col-span-1 row-span-1 w-full h-full overflow-hidden"
                  onClick={() => {
                    setActiveIndex(i + 1);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={photo.url}
                    alt={`${property.number} ${property.street} — photo ${i + 2}`}
                    fill
                    sizes="25vw"
                    style={{ objectFit: "cover" }}
                    loading="eager"
                  />
                  {isLast && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm font-semibold">
                      +{photos.length - 5} more
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={() => {
                setActiveIndex(0);
                setLightboxOpen(true);
              }}
              className="self-end text-sm underline text-gray-600 hover:text-gray-900"
            >
              See all {photos.length} photos
            </button>
          )}
        </div>

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
            Type: {property.propertyType} · {property.roomType} Room
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
            {new Date(property.availableFor).toLocaleDateString()}
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">
            <PropertyMap
              street={property.street}
              areaCode={property.areaCode}
              number={property.number}
            />
          </h2>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Listed by</h2>
          <p>{property.author.name}</p>
          <p className="text-gray-500">{property.author.email}</p>
        </section>
      </main>
      <Footer />

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
        >
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {activeIndex + 1} / {photos.length}
          </span>

          <button
            type="button"
            className="absolute top-4 right-4 text-white text-2xl leading-none"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>

          <button
            type="button"
            className="absolute left-4 text-white text-3xl px-3 py-1 rounded-full bg-black/40 hover:bg-black/60"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            ‹
          </button>

          <div
            className="relative w-[90vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[activeIndex].url}
              alt={`Photo ${activeIndex + 1}`}
              fill
              sizes="90vw"
              quality={100}
              style={{ objectFit: "contain" }}
              priority
              loading="eager"
            />
          </div>

          <button
            type="button"
            className="absolute right-4 text-white text-3xl px-3 py-1 rounded-full bg-black/40 hover:bg-black/60"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            ›
          </button>

          {photos.length > 1 && (
            <div className="absolute bottom-4 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
              {photos.map((photo, i) => (
                <button
                  key={photo.publicId || i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded transition-opacity ${
                    i === activeIndex
                      ? "opacity-100 ring-2 ring-white"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="80px"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PropertyPage;
