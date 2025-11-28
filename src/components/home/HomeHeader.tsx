"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import BaseHeader from "../common/BaseHeader";

export default function HomeHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <BaseHeader>
      {/* This navigation is specific to the Home page */}
      <nav className="flex justify-center items-center space-x-6">
        {session?.user.role === "ADMIN" && (
          <Link
            href="/admin"
            className={`font-medium ${
              pathname.startsWith("/admin")
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Admin
          </Link>
        )}
      </nav>
    </BaseHeader>
  );
}
