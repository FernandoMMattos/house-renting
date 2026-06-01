import { useRouter } from "next/navigation";
import Button from "./Button";

const filters = [
  {
    label: "Single Room",
    value: "single",
    param: "roomType",
  },
  { label: "Double Room", value: "double", param: "roomType" },
  { label: "Shared Room", value: "shared", param: "roomType" },
  { label: "House", value: "house", param: "propertyType" },
  { label: "Flat", value: "flat", param: "propertyType" },
  { label: "Apartment", value: "apartment", param: "propertyType" },
];

const DashboardSections = () => {
  const router = useRouter();

  const handleFilter = ({ value, param }: { value: string; param: string }) => {
    router.push(`/properties?${param}=${value}`);
  };

  return (
    <section className="mx-20 flex flex-col">
      <span className="font-bold text-2xl my-10">Browse by filters</span>
      <div className="mb-10 flex gap-4">
        {filters.map((filter) => (
          <Button key={filter.value} onClick={() => handleFilter(filter)}>
            {filter.label}
          </Button>
        ))}
      </div>
    </section>
  );
};

export default DashboardSections;
