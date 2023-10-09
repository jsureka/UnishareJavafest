// components/ProtectedRoute.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux"; // or your preferred state management library

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem("jwt_token")) {
      router.push("/login");
    }
    if (isAuthenticated && user?.role !== "ADMIN") {
      router.push("/dashboard/storefront/home");
    }
  }, [isAuthenticated, user, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
