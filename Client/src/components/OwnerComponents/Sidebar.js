// This component is the sidebar for the owner dashboard. It contains links to the owner dashboard, profile, properties, tenants, requests, transactions, and notifications.
"use client";

import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  Square2StackIcon,
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
      name: "Products",
      href: "/dashboard/owner/products",
      icon: Square2StackIcon,
      current: false,
    },
    {
      name: "Booking Requests",
      href: "/dashboard/owner/booking-requests",
      icon: FolderIcon,
      current: false,
    },
    { name: "Rentals", href: "#", icon: CalendarIcon, current: false },
    {
      name: "Reviews",
      href: "#",
      icon: DocumentDuplicateIcon,
      current: false,
    },
    { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
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
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-700 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h3 className="text-lg font-medium leading-6 text-white">
              Owner Dashboard
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
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800",
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
