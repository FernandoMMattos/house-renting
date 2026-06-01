"use client";
import AreaCodeFilter from "@/components/AreaCodeFilter";
import FormField from "@/components/FormField";
import Select from "@/components/Select";
import Input from "@/components/Input";
import { PropertyFilters } from "@/types/filters";

interface Props {
  values: PropertyFilters;
  onChange: (
    field: keyof PropertyFilters,
    value: PropertyFilters[keyof PropertyFilters],
  ) => void;
  onClear: () => void;
}

const hasActiveFilters = (filters: PropertyFilters) =>
  filters.areaCodes.length > 0 ||
  !!filters.roomType ||
  !!filters.propertyType ||
  !!filters.minPrice ||
  !!filters.maxPrice ||
  !!filters.bedrooms ||
  !!filters.bathrooms ||
  !!filters.sharingWith;

const PropertyFilterPanel = ({ values, onChange, onClear }: Props) => {
  const select =
    (field: keyof PropertyFilters) =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
      onChange(field, e.target.value);

  const activeCount = [
    values.areaCodes.length > 0,
    !!values.roomType,
    !!values.propertyType,
    !!values.minPrice,
    !!values.maxPrice,
    !!values.bedrooms,
    !!values.bathrooms,
    !!values.sharingWith,
  ].filter(Boolean).length;

  return (
    <aside className="w-72 shrink-0 flex flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-5 self-start sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 text-base">Filters</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-medium text-white">
              {activeCount}
            </span>
          )}
        </div>
        {hasActiveFilters(values) && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 cursor-pointer transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {/* Area codes */}
        <div className="py-4 first:pt-0">
          <AreaCodeFilter
            selected={values.areaCodes}
            onChange={(codes) => onChange("areaCodes", codes)}
          />
        </div>

        {/* Property type */}
        <div className="py-4">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Property type
          </label>
          <Select
            id="propertyType"
            value={values.propertyType}
            onChange={select("propertyType")}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-gray-800 focus:outline-none focus:ring-0"
          >
            <option value="">Any</option>
            <option value="house">House</option>
            <option value="flat">Flat</option>
            <option value="apartment">Apartment</option>
          </Select>
        </div>

        {/* Room type */}
        <div className="py-4">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Room type
          </label>
          <Select
            id="roomType"
            value={values.roomType}
            onChange={select("roomType")}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-gray-800 focus:outline-none focus:ring-0"
          >
            <option value="">Any</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="sharing">Sharing</option>
          </Select>
        </div>

        {/* Price range */}
        <div className="py-4">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Price range (€/mo)
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="minPrice"
              type="number"
              min="0"
              placeholder="Min"
              value={values.minPrice}
              onChange={select("minPrice")}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-gray-800 focus:outline-none"
            />
            <span className="text-gray-400 text-sm shrink-0">—</span>
            <Input
              id="maxPrice"
              type="number"
              min="0"
              placeholder="Max"
              value={values.maxPrice}
              onChange={select("maxPrice")}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-gray-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="py-4">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Bedrooms
          </label>
          <Select
            id="bedrooms"
            value={values.bedrooms}
            onChange={select("bedrooms")}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-gray-800 focus:outline-none focus:ring-0"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </Select>
        </div>

        {/* Bathrooms */}
        <div className="py-4">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Bathrooms
          </label>
          <Select
            id="bathrooms"
            value={values.bathrooms}
            onChange={select("bathrooms")}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-gray-800 focus:outline-none focus:ring-0"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </Select>
        </div>

        {/* Sharing with */}
        <div className="py-4 last:pb-0">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Sharing with
          </label>
          <Select
            id="sharingWith"
            value={values.sharingWith}
            onChange={select("sharingWith")}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-gray-800 focus:outline-none focus:ring-0"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </Select>
        </div>
      </div>
    </aside>
  );
};

export default PropertyFilterPanel;
