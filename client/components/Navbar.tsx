"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect } from "react";

export default function NavbarComponent() {
  const auth = useAuth();
  const linkClasses =
    "text-sm font-medium px-3 py-1 rounded hover:bg-white/10 transition text-white";

  let logged = !auth.loading && Boolean(auth.user?.logged);

  return (
    <nav className="bg-neutral-950 fixed inset-x-0 top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-14 flex items-center justify-between">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <Link href={"/"} className="text-white text-lg font-semibold">
              Chat App Demo
            </Link>
          </div>

          <div className="flex-1 px-4">
            <div className="hidden sm:block">
              <input
                aria-label="Search"
                className="w-full bg-neutral-900 text-white placeholder:text-neutral-400 rounded-md px-3 py-2 text-sm"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-2">
            <Link className={linkClasses} href={"/"}>
              Home
            </Link>

            {logged ? (
              <>
                <Link className={linkClasses} href="/dashboard">
                  Dashboard
                </Link>
                <Link
                  className={linkClasses}
                  href="#logout"
                  onClick={auth.DeleteAuthToken}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link className={linkClasses} href={"/login"}>
                  Login
                </Link>
                <Link className={linkClasses} href={"/register"}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
