"use client";

import { PropertyFilters } from "@/types/filters";
import usePropertyFilters from "@/hooks/usePropertyFilters";
import Button from "./Button";

const FILTERS_OPTIONS = [
  { label: "Single Room", value: "SINGLE", param: "roomType" },
  { label: "Double Room", value: "DOUBLE", param: "roomType" },
  { label: "Shared Room", value: "SHARED", param: "roomType" },
  { label: "House", value: "HOUSE", param: "propertyType" },
  { label: "Apartment", value: "APARTMENT", param: "propertyType" },
  { label: "Studio", value: "STUDIO", param: "propertyType" },
  { label: "Flat", value: "FLAT", param: "propertyType" },
];

const DashBoardSections = () => {
  const { handleChange } = usePropertyFilters();

  const handleFilter = ({ value, param }: { value: string; param: string }) => {
    handleChange(param as keyof PropertyFilters, value);
  };

  return (
    <section className="mx-4 md:mx-20 flex flex-col">
      <span className="font-bold text-xl md:text-2xl my-6 md:my-10">Browse by category</span>
      <div className="mb-6 md:mb-10 flex gap-3 overflow-x-auto pb-2">
        {FILTERS_OPTIONS.map((filter) => (
          <Button
            key={filter.value}
            onClick={() => handleFilter(filter)}
            className="shrink-0 text-sm"
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </section>
  );
};

export default DashBoardSections;
