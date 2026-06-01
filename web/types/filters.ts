export interface PropertyFilters {
  areaCodes: number[],
  roomType: string,
  propertyType: string,
  sharingWith: string,
  maxPrice: string,
  minPrice: string,
  bedrooms: string,
  bathrooms: string
}

export const EMPTY_FILTERS: PropertyFilters = {
  areaCodes: [],
  roomType: "",
  propertyType: "",
  sharingWith: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: ""
}