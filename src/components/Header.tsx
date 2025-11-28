"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isAuthenticated = status === "authenticated";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="w-full p-2 bg-white border-b shadow-sm sticky top-0 z-20">
      <div className="max-w-full mx-auto px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Electric 44 Logo"
              style={{ width: "160px", height: "57px" }}
            />
          </Link>
        </div>

        {/* Center Section: Main Navigation */}
        {isAuthenticated && (
          <nav className="flex-1 flex justify-center items-center space-x-6">
            <Link
              href="/planner"
              className={`font-medium ${
                pathname.startsWith("/planner")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Planificador
            </Link>
            <Link
              href="/calendar"
              className={`font-medium ${
                pathname.startsWith("/calendar")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Calendario
            </Link>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className={`font-medium ${
                  pathname.startsWith("/admin")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        )}

        {/* Right Section: Profile & Auth */}
        <div className="flex items-center justify-end space-x-4 flex-1">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <span className="font-medium text-sm text-gray-700 hidden md:inline">
                  {session.user?.email}
                </span>
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border">
                  <div className="p-4 border-b">
                    <p className="text-sm font-semibold text-gray-800">
                      {session.user?.name || "Usuario"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link
                      href={`/account/change-password?callbackUrl=${pathname}`}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Cambiar Contraseña
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-500 hover:text-white rounded-md"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
