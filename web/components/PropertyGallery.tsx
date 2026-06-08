"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Photo {
  url: string;
  publicId: string;
}

interface PropertyGalleryProps {
  photos: Photo[];
  number: number;
  street: string;
}

const PropertyGallery = ({ photos, number, street }: PropertyGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <div className="flex flex-col gap-2">
      {/* Mobile: snap-scroll carousel */}
      <div className="md:hidden relative">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory rounded-xl gap-2 no-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {photos.map((photo, i) => (
            <button
              key={photo.publicId || i}
              type="button"
              className="relative shrink-0 w-full aspect-4/3 rounded-xl overflow-hidden"
              onClick={() => {
                setActiveIndex(i);
                setLightboxOpen(true);
              }}
            >
              <Image
                src={photo.url}
                alt={`${number} ${street} — photo ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                quality={90}
                style={{ objectFit: "cover" }}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </button>
          ))}
        </div>
        {photos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: original grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-120 rounded-xl overflow-hidden">
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
            alt={`${number} ${street} — photo 1`}
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
                alt={`${number} ${street} — photo ${i + 2}`}
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
          className="hidden md:block self-end text-sm underline text-gray-600 hover:text-gray-900"
        >
          See all {photos.length} photos
        </button>
      )}

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
    </div>
  );
};

export default PropertyGallery;
