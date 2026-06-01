"use client";
import { useRef, useState, useEffect } from "react";

const AREA_CODES = Array.from({ length: 24 }, (_, i) => i + 1);

interface Props {
  selected: number[];
  onChange: (codes: number[]) => void;
}

const AreaCodeFilter = ({ selected, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (code: number) => {
    const next = selected.includes(code)
      ? selected.filter((c) => c !== code)
      : [...selected, code];
    onChange(next);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label =
    selected.length === 0
      ? "Any area"
      : `Dublin ${selected.sort((a, b) => a - b).join(", ")}`;

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Area (Dublin)
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 hover:border-gray-400 transition-colors"
      >
        <span className="truncate">{label}</span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden">
          {/* Select all / Clear */}
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <button
              type="button"
              onClick={() => onChange(AREA_CODES)}
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
              Select all
            </button>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Scrollable list */}
          <ul className="max-h-48 overflow-y-auto py-1">
            {AREA_CODES.map((code) => {
              const active = selected.includes(code);
              return (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => toggle(code)}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        active
                          ? "border-gray-800 bg-gray-800"
                          : "border-gray-300"
                      }`}
                    >
                      {active && (
                        <svg
                          className="h-2.5 w-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    <span
                      className={
                        active ? "font-medium text-gray-900" : "text-gray-600"
                      }
                    >
                      Dublin {code}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AreaCodeFilter;
