"use client";

import AreaCodeFilter from "@/components/AreaCodeFilter";
import Select from "@/components/Select";
import Input from "@/components/Input";
import { PropertyFilters } from "@/types/filters";
import { FaTimes } from "react-icons/fa";

interface Props {
  values: PropertyFilters;
  onChange: (
    field: keyof PropertyFilters,
    value: PropertyFilters[keyof PropertyFilters],
  ) => void;
  onClear: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const selectClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-gray-800 focus:outline-none focus:ring-0";

const FilterFields = ({
  values,
  onChange,
}: Pick<Props, "values" | "onChange">) => {
  const handle =
    (field: keyof PropertyFilters) =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
      onChange(field, e.target.value);

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      <div className="py-4 first:pt-0">
        <AreaCodeFilter
          selected={values.areaCodes}
          onChange={(codes: string[]) => onChange("areaCodes", codes)}
        />
      </div>

      <div className="py-4">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
          Property type
        </label>
        <Select id="propertyType" value={values.propertyType} onChange={handle("propertyType")} className={selectClass}>
          <option value="">Any</option>
          <option value="HOUSE">House</option>
          <option value="FLAT">Flat</option>
          <option value="APARTMENT">Apartment</option>
          <option value="STUDIO">Studio</option>
        </Select>
      </div>

      <div className="py-4">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
          Room type
        </label>
        <Select id="roomType" value={values.roomType} onChange={handle("roomType")} className={selectClass}>
          <option value="">Any</option>
          <option value="SINGLE">Single</option>
          <option value="DOUBLE">Double</option>
          <option value="SHARED">Shared</option>
        </Select>
      </div>

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
            onChange={handle("minPrice")}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-gray-800 focus:outline-none"
          />
          <span className="text-gray-400 text-sm shrink-0">—</span>
          <Input
            id="maxPrice"
            type="number"
            min="0"
            placeholder="Max"
            value={values.maxPrice}
            onChange={handle("maxPrice")}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-gray-800 focus:outline-none"
          />
        </div>
      </div>

      <div className="py-4">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
          Bedrooms
        </label>
        <Select id="bedrooms" value={values.bedrooms} onChange={handle("bedrooms")} className={selectClass}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
        </Select>
      </div>

      <div className="py-4">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
          Bathrooms
        </label>
        <Select id="bathrooms" value={values.bathrooms} onChange={handle("bathrooms")} className={selectClass}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
        </Select>
      </div>

      <div className="py-4 last:pb-0">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
          Sharing with
        </label>
        <Select id="sharingWith" value={values.sharingWith} onChange={handle("sharingWith")} className={selectClass}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
        </Select>
      </div>
    </div>
  );
};

const PropertyFilterPanel = ({
  values,
  onChange,
  onClear,
  mobileOpen = false,
  onMobileClose,
}: Props) => {
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

  const hasActiveFilters = activeCount > 0;

  const FilterHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900 text-base">Filters</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-medium text-white">
            {activeCount}
          </span>
        )}
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 cursor-pointer transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-5 self-start sticky top-20">
        <FilterHeader />
        <FilterFields values={values} onChange={onChange} />
      </aside>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex flex-col justify-end"
          onClick={onMobileClose}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-t-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-base">Filters</span>
                {activeCount > 0 && (
                  <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-medium text-white">
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                onClick={onMobileClose}
                className="text-gray-400 text-xl p-1"
                aria-label="Close filters"
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable filter fields */}
            <div className="overflow-y-auto px-5 py-2 flex-1">
              <FilterFields values={values} onChange={onChange} />
            </div>

            {/* Sheet footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
              {hasActiveFilters && (
                <button
                  onClick={() => { onClear(); }}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onMobileClose}
                className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors text-sm"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyFilterPanel;
