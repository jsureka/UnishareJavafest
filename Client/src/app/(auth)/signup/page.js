"use client";

import bangladeshUniversities from "@/mock/universityList";
import { Link } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        UniShare Ltd
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const [universities, setUniversities] = useState(bangladeshUniversities);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [filteredUniversities, setFilteredUniversities] = useState(
    bangladeshUniversities
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  // Function to handle ID card image upload
  const handleIdCardUpload = (event) => {
    const file = event.target.files[0];
    setIdCardImage(file);
  };

  // Function to handle profile image upload
  const handleProfileUpload = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  // Handle the search filter
  const handleSearchChange = (event, newValue) => {
    setSelectedUniversity(newValue);
    if (newValue) {
      // Filter the universities based on the user's input
      const filtered = universities.filter((university) =>
        university.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredUniversities(filtered);
    } else {
      // If input is cleared, show all universities
      setFilteredUniversities(universities);
    }
  };

  return (
    <div className="  ">
      <section class="bg-gray-50 dark:bg-zinc-200 p-9">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <Link
            href="/dashboard/storefront/home"
            class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-black"
          >
            <img
              class="w-8 h-8 mr-2"
              src="https://res.cloudinary.com/unishare/image/upload/v1694949615/Logo/Unishare_Logo.png"
              alt="logo"
            />
            UniShare
          </Link>
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                Register
              </h1>
              <form class="space-y-4 md:space-y-6" action="#">
                {/* Fullname */}
                <div>
                  <label
                    for="fullname"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John Doe"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <label
                    for="phoneNumber"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="01XXXXXXXXX"
                    required=""
                  />
                </div>
                {/* Address */}
                <div>
                  <label
                    for="address"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Address"
                    required=""
                  />
                </div>
                {/* Password */}
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                {/* Confirm Password */}
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                {/* University */}
                <div>
                  <label
                    for="university"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    University
                  </label>
                  <input
                    type="text"
                    name="university"
                    id="university"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="University"
                    required=""
                  />
                </div>
                {/* ID Card Image Upload */}
                <div>
                  <label
                    for="idCardImage"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    ID Card Image
                  </label>
                  <input
                    type="file"
                    name="idCardImage"
                    id="idCardImage"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                {/* Profile Image Upload */}
                <div>
                  <label
                    for="profileImage"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    id="profileImage"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>

                <button
                  type="submit"
                  class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign up
                </button>
                <p class="text-sm font-light text-gray-500 dark:text-gray-700">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-800"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
