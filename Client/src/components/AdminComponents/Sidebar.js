// This component is the sidebar for the owner dashboard. It contains links to the owner dashboard, profile, properties, tenants, requests, transactions, and notifications.
"use client";

import {
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  Square2StackIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

const navbarOptions = [
  { name: "🛍️ My Listings", href: "/listings" },
  { name: "📊 Sales Reports", href: "/sales-reports" },
  { name: "📦 Inventory Management", href: "/inventory" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = () => {
  const [navigation, setNavigation] = useState([
    {
      name: "Dashboard",
      href: "/dashboard/owner",
      icon: HomeIcon,
      current: true,
    },
    {
      name: "Categories",
      href: "/dashboard/admin/categories",
      icon: Square2StackIcon,
      current: false,
    },
    {
      name: "Products",
      href: "/dashboard/admin/products",
      icon: FolderIcon,
      current: false,
    },
    {
      name: "Users",
      href: "/dashboard/admin/users",
      icon: UserCircleIcon,
      current: false,
    },
    {
      name: "Universities",
      href: "/dashboard/admin/universities",
      icon: DocumentDuplicateIcon,
      current: false,
    },
    { name: "Logout", href: "#", icon: ChartPieIcon, current: false },
  ]);
  const router = useRouter();

  const handleClick = (e, clickedItem) => {
    e.preventDefault();
    const updatedItems = navigation.map((item) => ({
      ...item,
      current: item === clickedItem,
    }));

    setNavigation(updatedItems);
    // route
    router.push(clickedItem.href);
  };

  useEffect(() => {
    const path = window.location.pathname;
    const updatedItems = navigation.map((item) => ({
      ...item,
      current: item.href === path.includes(item.href),
    }));
    setNavigation(updatedItems);
  }, []);

  return (
    <>
      <div className="">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          <div className="">
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
            <h3 className="text-gray-200 text-sm font-medium tracking-wide mt-2">
              Admin Dashboard
            </h3>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-sky-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-sky-800",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                        onClick={(e) => handleClick(e, item)}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
