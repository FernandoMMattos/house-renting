"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => <p className="text-gray-400 text-sm">Loading map...</p>,
});

export default PropertyMap;
