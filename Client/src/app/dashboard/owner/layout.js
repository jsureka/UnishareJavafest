import ProtectedRoute from "@/authGaurd/ProtectedRoutes";
import Navbar from "@/components/BorrowerComponents/Navbar/Navbar";
import Sidebar from "@/components/OwnerComponents/Sidebar";

const layout = ({ children }) => {
  return (
    <>
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-col md:flex-row flex-1">
            <aside className=" w-full  dark:bg-gray-700 md:w-72">
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
