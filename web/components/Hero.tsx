"use client"

import { FaSearch } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import HeroBanner from "@/public/HeroBanner.webp";
import Header from "./Header";

const Hero = () => {
  const router = useRouter();

  const handleSearch = (codes: string[]) => {
    if (codes.length === 0) return;
    router.push(`/properties?areaCodes=${codes.join(",")}`);
  };

  return (
    <section
      className="w-full flex flex-col items-center text-center p-10 gap-10 bg-no-repeat bg-cover bg-center pb-40 text-white"
      style={{ backgroundImage: `url(${HeroBanner.src})` }}
    >
      <Header />
      <h1 className="text-5xl font-bold">
        Find your next home in Dublin
      </h1>
      <span className="flex items-center border-2 gap-4 p-4 rounded-sm w-1/3">
        <FaSearch className="text-2xl shrink-0" />
        <SearchBar
          placeholder="Ex: Dublin 1, 4, 8 — press Enter"
          onSearch={handleSearch}
        />
      </span>
    </section>
  );
};

export default Hero;
