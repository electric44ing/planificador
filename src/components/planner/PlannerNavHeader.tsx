"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import BaseHeader from "../common/BaseHeader";

export default function PlannerNavHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <BaseHeader>
      {/* This navigation is specific to the Planner module */}
      <nav className="flex justify-center items-center space-x-6">
        <Link
          href="/planner"
          className={`font-medium ${
            pathname.startsWith("/planner")
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Planificador
        </Link>
        <Link
          href="/calendar"
          className={`font-medium ${
            pathname.startsWith("/calendar")
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Calendario
        </Link>
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
