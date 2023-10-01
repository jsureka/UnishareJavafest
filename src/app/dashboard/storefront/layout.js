import Footer from "@/components/BorrowerComponents/Navbar/Footer";
import Navbar from "../../../components/BorrowerComponents/Navbar/Navbar";

const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div class="flex flex-col min-h-screen">{children}</div>
      <Footer />
    </>
  );
};

export default layout;
