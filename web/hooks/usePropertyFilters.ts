import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { EMPTY_FILTERS, PropertyFilters } from "@/types/filters";
import { filtersToParams } from "@/lib/property";

const paramsToFilters = (searchParams: URLSearchParams): PropertyFilters => ({
  areaCodes: searchParams.get("areaCodes")?.split(",").filter(Boolean) ?? [],
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
  const filters = paramsToFilters(searchParams);

  const updateFilters = useCallback(
    (next: PropertyFilters) => {
      router.replace(
        `/properties?${new URLSearchParams(filtersToParams(next)).toString()}`,
      );
    },
    [router],
  );

  const handleChange = useCallback(
    (
      field: keyof PropertyFilters,
      value: PropertyFilters[keyof PropertyFilters],
    ) => updateFilters({ ...filters, [field]: value }),
    [filters, updateFilters],
  );

  const handleClear = useCallback(
    () => updateFilters(EMPTY_FILTERS),
    [updateFilters],
  );

  return { filters, handleChange, handleClear };
};

export default usePropertyFilters;
