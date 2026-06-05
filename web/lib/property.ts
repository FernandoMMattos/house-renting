import { CreatePropertyData, UpdatePropertyData } from "@/types/property";
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
