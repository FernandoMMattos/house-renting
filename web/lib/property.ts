import { CreatePropertyData, UpdatePropertyData } from "@/types/property";
import api from "./api";

export const createProperty = async (data: CreatePropertyData) => {
  const { data: response } = await api.post("/properties", data);
  return response;
};

export const getProperties = async (filters?: Record<string, any>) => {
  const { areaCodes, ...rest } = filters ?? {};

  const params = new URLSearchParams();

  if (areaCodes?.length) {
    params.set("areaCodes", areaCodes.join(","));
  }

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

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

export const parseAreaCode = (searchTerm: string): number | undefined => {
  const match = searchTerm.trim().match(/\b(\d{1,2})\b/);
  return match ? Number(match[1]) : undefined;
};
