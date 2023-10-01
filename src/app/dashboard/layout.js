"use client";
import UserService from "@/lib/services/userService";
import { setUser } from "@/store/Slices/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("jwt_token")) {
      UserService.getCurrentUser()
        .then((res) => {
          dispatch(setUser(res));
        })
        .catch((err) => {
          localStorage.removeItem("jwt_token");
        });
    }
  }, []);
  return <div>{children}</div>;
};

export default Layout;
