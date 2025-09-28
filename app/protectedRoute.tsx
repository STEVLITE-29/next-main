"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, Role } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[]; // optional role-based access
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    const validate = async () => {
      try {
        await checkAuth(); // validate token + fetch user
      } catch {
        router.replace("/signin");
      }
    };

    if (!user) validate();
  }, [user, checkAuth, router]);

  // Still checking
  if (isLoading) return <p>Loading...</p>;

  // Not logged in
  if (!user) return null;

  // Role-based protection
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <p className="text-red-500">
        ⛔ You don’t have permission to view this page.
      </p>
    );
  }

  return <>{children}</>;
}
