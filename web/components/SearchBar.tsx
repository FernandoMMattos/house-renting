import { useState, KeyboardEvent } from "react";
import { parseAreaCodes } from "@/lib/parseAreaCodes";

interface SearchBarProps {
  onSearch: (codes: number[]) => void;
  placeholder: string;
}

const SearchBar = ({ onSearch, placeholder }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<number[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const parsed = parseAreaCodes(inputValue);
    if (parsed.length === 0) return;

    // merge with existing, deduplicate
    const merged = [...new Set([...selectedCodes, ...parsed])].sort(
      (a, b) => a - b,
    );

    setSelectedCodes(merged);
    setInputValue("");
    onSearch(merged);
  };

  const removeCode = (code: number) => {
    const next = selectedCodes.filter((c) => c !== code);
    setSelectedCodes(next);
    onSearch(next);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 w-full">
      {/* Selected area tags */}
      {selectedCodes.map((code) => (
        <span
          key={code}
          className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-sm text-white backdrop-blur-sm"
        >
          D{code}
          <button
            type="button"
            onClick={() => removeCode(code)}
            className="leading-none hover:text-gray-300 cursor-pointer"
          >
            ✕
          </button>
        </span>
      ))}

      {/* Input */}
      <input
        id="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          selectedCodes.length > 0 ? "Add more areas..." : placeholder
        }
        className="focus:outline-0 bg-transparent flex-1 min-w-[120px] placeholder-white/70"
        type="search"
      />
    </div>
  );
};

export default SearchBar;
