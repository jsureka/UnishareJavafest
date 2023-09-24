"use client";
import { Popover } from "@headlessui/react";
import {
  Bars3Icon,
  BellAlertIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("/");
  const navbarItems = [
    { name: "Home", key: "/", href: "/dashboard/storefront/home" },
    {
      name: "Products",
      key: "products",
      href: "/dashboard/storefront/products",
    },
    {
      name: "My Request",
      key: "myrequests",
      href: "/dashboard/storefront/myrequests",
    },
    { name: "History", key: "history", href: "/dashboard/storefront/history" },
  ];
  return (
    <div className="relative bg-gray-600">
      {/* Navigation */}
      <header className="relative z-10">
        <nav aria-label="Top">
          {/* Top navigation */}
          <div className="bg-gray-900">
            <div className="mx-auto flex h-10 max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
              <div className="flex items-right space-x-6">
                {/* sign in route */}
                <Link
                  href="/login"
                  className="text-sm font-medium text-white hover:text-gray-100"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-white hover:text-gray-100"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary navigation */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md backdrop-filter">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div>
                <div className="flex h-16 items-center justify-between">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:flex-1 lg:items-center">
                    <a href="#" className=" flex items-center">
                      <img
                        className="h-10 w-auto"
                        src="https://res.cloudinary.com/unishare/image/upload/v1694949615/Logo/Unishare_Logo.png"
                        alt="UniShare"
                      />
                      <h2 className=" text-2xl font-bold tracking-tight text-white ml-2">
                        UniShare
                      </h2>
                    </a>
                  </div>

                  <div className="hidden h-full lg:flex">
                    {/* Flyout menus */}
                    <Popover.Group className="inset-x-0 bottom-0 px-4">
                      <div className="flex h-full justify-center space-x-8">
                        {navbarItems.map((page) => (
                          <Link
                            key={page.name}
                            href={page.href}
                            className="flex items-center text-sm font-medium text-white"
                          >
                            {page.name}
                          </Link>
                        ))}
                      </div>
                    </Popover.Group>
                  </div>

                  {/* Mobile menu and search (lg-) */}
                  <div className="flex flex-1 items-center lg:hidden">
                    <button
                      type="button"
                      className="-ml-2 p-2 text-white"
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <span className="sr-only">Open menu</span>
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Search */}
                  </div>

                  {/* Logo (lg-) */}
                  <a href="#" className="lg:hidden">
                    <span className="sr-only">Your Company</span>
                    <img
                      src="https://tailwindui.com/img/logos/mark.svg?color=white"
                      alt=""
                      className="h-8 w-auto"
                    />
                  </a>

                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      {/* Help */}
                      <a href="#" className="p-2 text-white lg:hidden">
                        <span className="sr-only">Help</span>
                        <QuestionMarkCircleIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </a>
                      {/* Owner Dashboard button, white background */}
                      <Link
                        href="/dashboard/owner"
                        className="hidden lg:block text-sm font-medium text-gray-100 hover:text-black p-2 hover:bg-white bg-gray-400 rounded-lg mr-5"
                      >
                        Owner Dashboard
                      </Link>
                      <div className="ml-4 flow-root lg:ml-8">
                        <a
                          href="#"
                          className="group -m-2 flex items-center p-2"
                        >
                          <BellAlertIcon
                            className="h-6 w-6 flex-shrink-0 mr-4 text-white"
                            aria-hidden="true"
                          />
                          <UserCircleIcon
                            className="flex-shrink-0 h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
