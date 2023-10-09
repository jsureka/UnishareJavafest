"use client";
import UserService from "@/lib/services/userService";
import { Popover } from "@headlessui/react";
import {
  Bars3Icon,
  BellAlertIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Tooltip,
} from "@material-tailwind/react";
import { ArrowCircleRightOutlined } from "@mui/icons-material";
import { Drawer } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.currentUser);
  const [notifications, setNotifications] = useState([]);
  const handleNotificationClick = () => {
    UserService.getNotifications().then((res) => {
      setNotifications(res);
    });
  };
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
    { name: "Orders", key: "history", href: "/dashboard/storefront/history" },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      UserService.getNotifications().then((res) => {
        res.splice(5, res.length - 5);
        setNotifications(res);
      });
    }
  }, [isAuthenticated]);
  return (
    <div className="relative bg-gray-600">
      {/* Navigation */}
      <header className="relative z-10">
        <nav aria-label="Top">
          {/* Top navigation */}
          {!isAuthenticated && (
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
          )}

          {/* Secondary navigation */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md backdrop-filter">
            <div className="  px-4 sm:px-6 lg:px-">
              <div className=" ">
                <div className="flex h-16 ">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:flex-1 lg:items-center">
                    <Link
                      href="/dashboard/storefront/home"
                      className=" flex items-center"
                    >
                      <img
                        className="h-10 w-auto"
                        src="https://res.cloudinary.com/unishare/image/upload/v1694949615/Logo/Unishare_Logo.png"
                        alt="UniShare"
                      />
                      <h2 className=" text-2xl font-bold tracking-tight text-white ml-2">
                        UniShare
                      </h2>
                    </Link>
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
                    <Drawer
                      anchor="left"
                      open={mobileMenuOpen}
                      onClose={() => setMobileMenuOpen(false)}
                    >
                      <div className="px-2 pt-2 pb-3 space-y-1">
                        {navbarItems.map((page) => (
                          <Link
                            key={page.name}
                            href={page.href}
                            className="text-gray-800 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                          >
                            {page.name}
                          </Link>
                        ))}
                      </div>
                    </Drawer>
                  </div>

                  {/* Logo (lg-) */}
                  <Link
                    href="/dashboard/storefront/home"
                    className=" flex items-center lg:hidden"
                  >
                    <img
                      className="h-10 w-auto"
                      src="https://res.cloudinary.com/unishare/image/upload/v1694949615/Logo/Unishare_Logo.png"
                      alt="UniShare"
                    />
                    <h2 className=" text-2xl font-bold tracking-tight text-white ml-2">
                      UniShare
                    </h2>
                  </Link>

                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      {user && user.blocked && (
                        <div className="flex items-center">
                          <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-4">
                            Restricted
                          </span>
                        </div>
                      )}
                      {user && !user.verified && !user.emailVerified && (
                        <>
                          <div className="flex items-center">
                            <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-4">
                              Not Verified
                            </span>
                          </div>
                        </>
                      )}
                      {user && user.emailVerified && !user.verified && (
                        <>
                          <div className="flex items-center">
                            <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-4">
                              Email Verified
                            </span>
                          </div>
                        </>
                      )}
                      {user && user.verified && !user.emailVerified && (
                        <>
                          <div className="flex items-center">
                            <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-4">
                              ID Verified
                            </span>
                          </div>
                        </>
                      )}
                      {user && user.verified && user.emailVerified && (
                        <>
                          <div className="flex items-center">
                            <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-4">
                              Verified
                            </span>
                          </div>
                        </>
                      )}
                      {isAuthenticated && (
                        <Link
                          href="/dashboard/owner"
                          className="hidden lg:block text-sm font-medium text-gray-100 hover:text-black p-2 hover:bg-white bg-gray-400 rounded-lg mr-5"
                        >
                          Owner Dashboard
                        </Link>
                      )}
                      <div className="ml-4 flow-root lg:ml-8">
                        <p
                          href="#"
                          className="group -m-2 flex items-center p-2"
                        >
                          {/* Logout Icon  */}
                          {isAuthenticated && (
                            <>
                              <Menu>
                                <MenuHandler>
                                  <BellAlertIcon
                                    className="flex-shrink-0 h-6 w-6 mr-4 text-white"
                                    aria-hidden="true"
                                    onClick={handleNotificationClick}
                                  />
                                </MenuHandler>
                                <MenuList className="">
                                  {notifications &&
                                    notifications.map((notification) => (
                                      <MenuItem key={notification.id}>
                                        <div class="block max-w-[18rem] rounded-lg border border-success bg-transparent  dark:bg-white">
                                          <div class="p-6">
                                            <p class="text-sm text-success font-semibold">
                                              {notification.message}
                                            </p>
                                          </div>
                                          <div class="border-t-2 border-success px-6 py-3 text-neutral-600 dark:border-success-30">
                                            {/* createdAt */}
                                            <p class="text-xs">
                                              {notification.createdAt}
                                            </p>
                                          </div>
                                        </div>
                                      </MenuItem>
                                    ))}
                                </MenuList>
                              </Menu>
                              <Link
                                href="/dashboard/storefront/user"
                                className="text-sm font-medium text-white hover:text-gray-100"
                              >
                                <UserCircleIcon
                                  className="flex-shrink-0 h-6 w-6 mr-4 text-white"
                                  aria-hidden="true"
                                />
                              </Link>
                              <button
                                onClick={() => {
                                  localStorage.removeItem("jwt_token");
                                  localStorage.removeItem("refresh_token");
                                  localStorage.removeItem("user");
                                  window.location.href = "/login";
                                  toast.success("Logout successful");
                                }}
                                className="text-sm font-medium text-white hover:text-gray-100"
                              >
                                <Tooltip
                                  content="Logout"
                                  className="text-black z-10 bg-slate-300"
                                  placement="bottom"
                                >
                                  <ArrowCircleRightOutlined
                                    className="flex-shrink-0 h-6 w-6 text-white"
                                    aria-hidden="true"
                                  />
                                </Tooltip>
                              </button>
                            </>
                          )}
                        </p>
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
