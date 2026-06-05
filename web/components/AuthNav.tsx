"use client"

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const AuthNav = () => {
  const { user } = useAuth();

  if (user)
    return (
      <div className="flex gap-4">
        <Link href="/place-ad">Announce</Link>
        <Link href="/profile">
          My Profile
        </Link>
      </div>
    );

  return (
    <div className="flex gap-4">
      <Link href="/login">Sign In</Link>
      <Link href="/register">Sign Up</Link>
    </div>
  );
};

export default AuthNav;
