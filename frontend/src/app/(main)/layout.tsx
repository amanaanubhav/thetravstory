"use client";

import MainLayout from "@/app/layouts/MainLayout";
import { useUser } from "@/app/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProtectedLayout({ children }) {
  const { isAuthenticated, isAuthLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}

export default function MainGroupLayout({ children }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
