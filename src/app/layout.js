"use client"; // Because we're inside a server component
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import store from "../store";

import { ToastContainer } from "react-toastify";
import "./globals.css";
const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        ></meta>
        <title>Unishare</title>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkBNch66QwlX2bWun9ka43xSs2midkw18&libraries=places"></script>
      </head>
      <body>
        <Provider store={store}>{children}</Provider>
        <ToastContainer
          position="bottom-right"
          autoClose={3999}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />{" "}
      </body>
    </html>
  );
};

export default RootLayout;
