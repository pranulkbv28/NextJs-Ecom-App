"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="navbar-styles">
      <Link
        href="/"
        className={pathname === "/" ? "text-red-300" : "text-white"}
      >
        Home
      </Link>
      <Link
        href="/auth/login"
        className={pathname === "/auth/login" ? "text-red-300" : "text-white"}
      >
        Login
      </Link>
      <Link
        href="/auth/register"
        className={
          pathname === "/auth/register" ? "text-red-300" : "text-white"
        }
      >
        Register
      </Link>
    </nav>
  );
}

export default NavBar;
