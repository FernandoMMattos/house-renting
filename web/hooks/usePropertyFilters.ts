import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { EMPTY_FILTERS, PropertyFilters } from "@/types/filters";

const filtersToParams = (filters: PropertyFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.areaCodes.length > 0)
    params.set("areaCodes", filters.areaCodes.join(","));
  if (filters.roomType) params.set("roomType", filters.roomType);
  if (filters.propertyType) params.set("propertyType", filters.propertyType);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
  if (filters.bathrooms) params.set("bathrooms", filters.bathrooms);
  if (filters.sharingWith) params.set("sharingWith", filters.sharingWith);
  return params;
};

const paramsToFilters = (searchParams: URLSearchParams): PropertyFilters => ({
  areaCodes: searchParams.get("areaCodes")
    ? searchParams.get("areaCodes")!.split(",").map(Number)
    : [],
  roomType: searchParams.get("roomType") ?? "",
  propertyType: searchParams.get("propertyType") ?? "",
  minPrice: searchParams.get("minPrice") ?? "",
  maxPrice: searchParams.get("maxPrice") ?? "",
  bedrooms: searchParams.get("bedrooms") ?? "",
  bathrooms: searchParams.get("bathrooms") ?? "",
  sharingWith: searchParams.get("sharingWith") ?? "",
});

const usePropertyFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<PropertyFilters>(() =>
    paramsToFilters(searchParams),
  );

  const updateFilters = (next: PropertyFilters) => {
    setFilters(next);
    router.replace(`?${filtersToParams(next).toString()}`);
  };

  const handleChange = (
    field: keyof PropertyFilters,
    value: PropertyFilters[keyof PropertyFilters],
  ) => updateFilters({ ...filters, [field]: value });

  const handleClear = () => updateFilters(EMPTY_FILTERS);

  return { filters, handleChange, handleClear };
};

export default usePropertyFilters;
