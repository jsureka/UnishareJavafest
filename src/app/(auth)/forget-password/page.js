"use client";
import AuthService from "@/lib/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const data = {
      email: formData.email,
      passwordResetToken: formData.token,
      newPassword: formData.newPassword,
    };
    AuthService.resetPassword(data)

      .then((res) => {
        toast.success("Password reset successfully");
        router.push("/login");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission with formData
    const data = {
      email: formData.email,
    };
    AuthService.forgetPassword(data)
      .then((res) => {
        toast.success("Email sent successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <Link
        href="/dashboard/storefront/home"
        class="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 dark:text-black"
      >
        <img
          class="w-8 h-8 mr-2"
          src="https://res.cloudinary.com/unishare/image/upload/v1694949615/Logo/Unishare_Logo.png"
          alt="logo"
        />
        UniShare
      </Link>
      <div className="text-center">
        <h1 className="text-4xl font-medium">Reset password</h1>
        <p className="text-slate-500">Fill up the form to reset the password</p>
      </div>
      <form action="" className="my-10">
        <div className="flex flex-col space-y-5">
          <div className="flex flex-wrap space-y-5">
            <label htmlFor="email" className=" w-2/3">
              <p className="font-medium text-slate-700 ">Email address</p>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <div className=" w-1/3 px-2">
              <button
                onClick={handleSubmit}
                className=" h-10 w-full py-3 mt-1 font-medium  text-white bg-gray-800 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
              >
                <span>Send OTP</span>
              </button>
            </div>
          </div>
          <label htmlFor="token">
            <p className="font-medium text-slate-700 pb-2">Token</p>
            <input
              id="token"
              name="token"
              type="text"
              value={formData.token}
              onChange={handleChange}
              className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Enter token"
            />
          </label>
          <label htmlFor="newPassword">
            <p className="font-medium text-slate-700 pb-2">New Password</p>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Enter new password"
            />
          </label>
          <label htmlFor="confirmPassword">
            <p className="font-medium text-slate-700 pb-2">Confirm Password</p>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Confirm password"
            />
          </label>
          {/* reset button*/}
          <button
            onClick={handleResetPassword}
            className="w-full py-3 font-medium text-white bg-gray-800 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>

            <span>Reset password</span>
          </button>
          <p className="text-center">
            Not registered yet?{" "}
            <Link
              href="/signup"
              className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
            >
              <span>Register now </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Page;
