"use client";

import UserService from "@/lib/services/userService";
import { setUser } from "@/store/Slices/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const categories = [
  {
    name: "Books",
    href: "#",
    imageSrc:
      "https://res.cloudinary.com/unishare/image/upload/v1694962158/Logo/books-2022464_1280_nr2kjc.png",
  },
  {
    name: "Furnitures",
    href: "#",
    imageSrc:
      "https://res.cloudinary.com/unishare/image/upload/v1694962112/Logo/armchair-2026633_1280_v4cwfn.png",
  },
  {
    name: "Wrist Watches",
    href: "#",
    imageSrc:
      "https://res.cloudinary.com/unishare/image/upload/v1694962229/Logo/watch-42803_1280_yfu00a.png",
  },
  {
    name: "Bicycles",
    href: "#",
    imageSrc:
      "https://res.cloudinary.com/unishare/image/upload/v1694962041/Logo/bicycle-161524_1280_ld6vcr.png",
  },
  {
    name: "Bikes",
    href: "#",
    imageSrc:
      "https://res.cloudinary.com/unishare/image/upload/v1694961659/Logo/bike.png",
  },
];

export default function page() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  useEffect(() => {
    UserService.getCurrentUser()
      .then((res) => {
        dispatch(setUser(res.data));
      })
      .catch((err) => {
        localStorage.removeItem("jwt_token");
      });
  }, []);

  return (
    <div className="bg-white">
      <main>
        {/* Hero section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative px-4 py-10 sm:px-6  lg:py-16 lg:px-8">
              <div className=" grid grid-cols-2">
                <div className=" px-4 py-16 sm:px-6  lg:py-18 lg:px-8">
                  <h1 className="text-4xl font-extrabold tracking-tight text-black">
                    Why Sell When Rent?
                  </h1>
                  <p className="mt-6 max-w-3xl text-xl text-black">
                    Welcome to the ultimate student commodity rental
                    marketplace, where convenience meets community. Our platform
                    is designed to simplify your student life by providing a
                    seamless way for you to access the things you need, connect
                    with your peers, and thrive during your college journey.
                  </p>
                </div>
                {/* image */}
                <div className="relative w-full h-full">
                  <img
                    src="https://res.cloudinary.com/unishare/image/upload/v1694961836/Logo/Rent._1_bezqkd.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/*  */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Category section */}
        <section
          aria-labelledby="category-heading"
          className="pt-24  xl:mx-auto xl:max-w-7xl xl:px-8"
        >
          <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
            <h2
              id="category-heading"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              Shop by Category
            </h2>
            <a
              href="#"
              className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
            >
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          <div className="mt-4 flow-root">
            <div className="-my-2">
              <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
                <div className="absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href={category.href}
                      className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto"
                    >
                      <span aria-hidden="true" className="absolute inset-0">
                        <img
                          src={category.imageSrc}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                      />
                      <span className="relative mt-auto text-center text-xl font-bold text-white">
                        {category.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 px-4 sm:hidden">
            <a
              href="#"
              className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </section>

        {/* Featured section */}
        <section
          aria-labelledby="social-impact-heading"
          className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8 my-10"
        >
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                src="https://res.cloudinary.com/unishare/image/upload/v1694962313/Logo/ecommerce-2140604_1280_e18mpq.jpg"
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="relative bg-gray-900 bg-opacity-75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2
                  id="social-impact-heading"
                  className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                  <span className="block sm:inline">Rent your </span>
                  <p className="block sm:inline">less needed goods</p>
                </h2>
                <p className="mt-3 text-xl text-white">
                  Welcome to the ultimate student commodity rental marketplace,
                  where convenience meets community. Our platform is designed to
                  simplify your student life by providing a seamless way for you
                  to access the things you need, connect with your peers, and
                  thrive during your college journey.
                </p>
                <a
                  href="#"
                  className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                >
                  Shop
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
