"use client";
import ProtectedRoute from "@/authGaurd/ProtectedRoutes";
import Navbar from "@/components/BorrowerComponents/Navbar/Navbar";
import Sidebar from "@/components/OwnerComponents/Sidebar";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const layout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const router = useRouter();
  if (!isAuthenticated) {
    router.push("/login");
  }
  return (
    <>
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-col md:flex-row flex-1">
            <aside className=" w-full  dark:bg-gray-700 md:w-60">
              <Sidebar />
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default layout;
