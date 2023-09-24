import Footer from "@/components/BorrowerComponents/Navbar/Footer";
import Navbar from "../../../components/BorrowerComponents/Navbar/Navbar";

const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default layout;
