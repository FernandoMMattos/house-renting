export interface Property {
  id: string;
  street: string;
  number: number;
  areaCode: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sharingWith: number;
  propertyType: string;
  roomType: string;
  description: string;
  eirCode: string;
  availableFrom: string;
  availableFor: string;
  image: {
    url: string;
    publicId: string;
  }[];
  author: {
    name: string;
    email: string;
  };
}

export type CreatePropertyData = Omit<Property, "id" | "image" | "author">;

export type UpdatePropertyData = Optional<Property>

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
  | "image"
>;
