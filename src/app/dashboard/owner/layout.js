"use client";
import Navbar from "@/components/BorrowerComponents/Navbar/Navbar";
import Sidebar from "@/components/OwnerComponents/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const layout = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row flex-1">
          <aside className=" w-full  dark:bg-gray-700 md:w-60">
            <Sidebar />
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
};

export default layout;
