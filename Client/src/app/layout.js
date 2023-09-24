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
        <title>Unishare</title>
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
