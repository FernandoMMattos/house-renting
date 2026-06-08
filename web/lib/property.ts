import { CreatePropertyData, Property, UpdatePropertyData } from "@/types/property";
import api from "./api";
import { EMPTY_FILTERS, PropertyFilters } from "@/types/filters";

export const createProperty = async (data: CreatePropertyData) => {
  const { data: response } = await api.post("/properties", data);
  return response;
};

export const getProperties = async (filters?: Partial<PropertyFilters>) => {
  const params = filtersToParams(filters ?? EMPTY_FILTERS);
  const { data } = await api.get("/properties", { params });
  return data;
};

export const getProperty = async (id: string) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export const updateProperty = async (id: string, data: UpdatePropertyData) => {
  const { data: response } = await api.patch(`/properties/${id}`, data);
  return response;
};

export const getMyProperties = async () => {
  const { data } = await api.get("/properties/me");
  return data;
};

export const filtersToParams = (filters: Partial<PropertyFilters>) =>
  Object.fromEntries(
    Object.entries(filters)
      .filter(([, v]) => (Array.isArray(v) ? v.length > 0 : v !== ""))
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : v]),
  );

export const searchParamsToFilters = (
  params: Record<string, string | string[] | undefined>,
): PropertyFilters => ({
  areaCodes:
    typeof params.areaCodes === "string"
      ? params.areaCodes.split(",").filter(Boolean)
      : [],
  roomType: (params.roomType as string) ?? "",
  propertyType: (params.propertyType as string) ?? "",
  minPrice: (params.minPrice as string) ?? "",
  maxPrice: (params.maxPrice as string) ?? "",
  bedrooms: (params.bedrooms as string) ?? "",
  bathrooms: (params.bathrooms as string) ?? "",
  sharingWith: (params.sharingWith as string) ?? "",
});

export const getPropertiesServer = async (
  filters?: Partial<PropertyFilters>,
): Promise<Property[]> => {
  const params = filtersToParams(filters ?? EMPTY_FILTERS);
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  const res = await fetch(
    `${baseUrl}/properties${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []) as Property[];
};
