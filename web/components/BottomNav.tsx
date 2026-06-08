"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaSearch, FaPlus, FaUser } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const BottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: "/dashboard", icon: FaHome, label: "Home" },
    { href: "/properties", icon: FaSearch, label: "Search" },
    { href: "/place-ad", icon: FaPlus, label: "Post" },
    { href: user ? "/profile" : "/login", icon: FaUser, label: user ? "Profile" : "Sign In" },
  ];

  return (
    <nav className="shrink-0 bg-white border-t border-gray-200 flex md:hidden">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href === "/properties" && pathname.startsWith("/properties"));
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
              active ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon className={`text-xl ${active ? "text-gray-900" : "text-gray-400"}`} />
            <span className={active ? "font-semibold" : ""}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
