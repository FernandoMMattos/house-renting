export interface Property {
  id: string;
  street: string;
  number: number;
  areaCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sharingWith: number;
  propertyType: string;
  roomType: string;
  description: string;
  eirCode: string;
  availableFrom: Date;
  availableUntil: Date;
  isActive: boolean;
  images: {
    url: string;
    publicId: string;
  }[];
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export type CreatePropertyData = Omit<
  Property,
  "id" | "images" | "author" | "isActive"
>;

export type UpdatePropertyData = Partial<
  Omit<Property, "id" | "author" | "images">
>;

export type PropertyCard = Pick<
  Property,
  | "id"
  | "street"
  | "number"
  | "areaCode"
  | "price"
  | "bedrooms"
  | "bathrooms"
  | "sharingWith"
  | "propertyType"
  | "roomType"
  | "images"
>;
