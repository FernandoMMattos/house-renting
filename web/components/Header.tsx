"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-4 py-3 bg-white border-b border-gray-100 shadow-sm md:px-8">
        <Link
          href="/"
          className="font-bold text-xl text-gray-900 tracking-tight"
        >
          Dublin Rentals
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {user ? (
            <>
              <Link
                href="/place-ad"
                className="hover:text-gray-900 transition-colors"
              >
                Post a Property
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-700 text-xl p-1"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      </header>

      {/* Mobile slide-in drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <nav
            className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col p-6 gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg text-gray-900">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 text-xl p-1"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-gray-800 py-3 border-b border-gray-100 hover:text-gray-600"
            >
              Home
            </Link>
            <Link
              href="/properties"
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-gray-800 py-3 border-b border-gray-100 hover:text-gray-600"
            >
              Search Properties
            </Link>

            {user ? (
              <>
                <Link
                  href="/place-ad"
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-gray-800 py-3 border-b border-gray-100 hover:text-gray-600"
                >
                  Post a Property
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-gray-800 py-3 border-b border-gray-100 hover:text-gray-600"
                >
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 text-center px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 text-center px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
