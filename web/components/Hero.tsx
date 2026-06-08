"use client";

import { FaSearch } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import HeroBanner from "@/public/HeroBanner.webp";

const Hero = () => {
  const router = useRouter();

  const handleSearch = (codes: string[]) => {
    if (codes.length === 0) return;
    router.push(`/properties?areaCodes=${codes.join(",")}`);
  };

  return (
    <section
      className="w-full flex flex-col items-center text-center px-4 py-14 md:py-24 gap-6 md:gap-10 bg-no-repeat bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${HeroBanner.src})` }}
    >
      <h1 className="text-3xl md:text-5xl font-bold max-w-xl leading-tight">
        Find your next home in Dublin
      </h1>
      <span className="flex items-center gap-3 px-4 py-3 md:py-4 rounded-xl w-full max-w-sm md:max-w-lg bg-white/15 backdrop-blur-sm border border-white/30">
        <FaSearch className="text-lg md:text-2xl shrink-0 text-white/80" />
        <SearchBar
          placeholder="Ex: Dublin 1, 4, 8 — press Enter"
          onSearch={handleSearch}
        />
      </span>
    </section>
  );
};

export default Hero;
