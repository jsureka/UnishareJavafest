"use client";
import {
  CheckBadgeIcon,
  CurrencyBangladeshiIcon,
  EyeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { Check } from "@mui/icons-material";
import { useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      {/* dashboard analytics */}
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-4">
          <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default border-strokedark bg-boxdark p-3">
            <div className="flex h-11.5 w-11.5  rounded-full bg-meta-2 ">
              <EyeIcon className="h-6 w-6" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black">$3.456K</h4>
                <span className="text-sm font-medium">Total products</span>
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default border-strokedark bg-boxdark p-3">
            <div className="flex h-11.5 w-11.5  rounded-full bg-meta-2 ">
              <ShoppingBagIcon className="h-6 w-6" />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black">456</h4>
                <span className="text-sm font-medium">Total rents</span>
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default border-strokedark bg-boxdark p-3">
            <div className="flex h-11.5 w-11.5  rounded-full bg-meta-2 ">
              <CurrencyBangladeshiIcon className="h-6 w-6" />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black">Tk. 3043</h4>
                <span className="text-sm font-medium">Total income</span>
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default border-strokedark bg-boxdark p-3">
            <div className="flex h-11.5 w-11.5  rounded-full bg-meta-2 ">
              <Check className="h-6 w-6" />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-green">90%</h4>
                <span className="text-sm font-medium">Completion Rate</span>
              </div>
            </div>
          </div>
          {/* <CardTwo />
          <CardThree />
          <CardFour /> */}
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          {/* Email verification status */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-3">
            <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default border-strokedark bg-boxdark p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-11.5 w-11.5  rounded-full bg-meta-2 ">
                    <EyeIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-title-md font-bold text-black">
                      Email Verification
                    </h4>
                    <span className="text-sm font-medium">
                      Verify your email address
                    </span>
                  </div>
                </div>
                {user && user.emailVerified && (
                  <div className="flex items-center">
                    <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                    <button className="bg-primary text-green-600 font-bold py-2 px-4 rounded">
                      Verified
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Phone verification status */}
          {/* <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-3">
            <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default border-strokedark bg-boxdark p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-11.5 w-11.5  rounded-full bg-meta-2 ">
                    <EyeIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-title-md font-bold text-black">
                      Phone Verification
                    </h4>
                    <span className="text-sm font-medium">
                      Verify your phone number
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="bg-primary text-red-500 font-bold py-2 px-4 rounded">
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div> */}
          {/* NID verification status */}
          <div
            className="col-span-12 md:col-span-6
            xl:col-span-4 2xl:col-span-3"
          >
            <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default border-strokedark bg-boxdark p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-11.5 w-11.5  rounded-full bg-meta-2 ">
                    <EyeIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-title-md font-bold text-black">
                      IC Card Verification
                    </h4>
                    <span className="text-sm font-medium">Verify your ID Card</span>
                  </div>
                </div>
                {user && user.verified && (
                  <div className="flex items-center">
                    <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                    <button className="bg-primary text-green-600 font-bold py-2 px-4 rounded">
                      Verified
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Page;
