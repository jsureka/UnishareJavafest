import ProtectedRoute from "@/authGaurd/ProtectedRoutes";
import Sidebar from "@/components/AdminComponents/Sidebar";

const layout = ({ children }) => {
  return (
    <>
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-col md:flex-row flex-1">
            <aside className=" w-full  dark:bg-sky-950 md:w-72 p-3">
              <Sidebar></Sidebar>
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default layout;
