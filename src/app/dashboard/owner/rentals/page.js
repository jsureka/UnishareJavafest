"use client";

import CommonTable from "@/components/GlobalComponents/CommonTable";
import Pagination from "@/components/GlobalComponents/Pagination";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import BookingService from "@/lib/services/bookingService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [bookings, setBookings] = useState(null);
  const [activeTab, setActiveTab] = useState("accepted"); // Set the initial active tab
  const [pagination, setPagination] = useState({
    currentPage: 0,
    postsPerPage: 5,
    currentElements: 0,
    totalPosts: 0,
  });
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    getBookings(tabId);
  };
  const handleReturned = (id) => {
    BookingService.markAsReturned(id)
      .then((res) => {
        toast.success("Marked as returned");
        getBookings();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleReject = (id) => {
    console.log("reject");
  };

  const paginateBack = () => {
    if (pagination.currentPage <= 0) return;
    else
      BookingService.ownerRentals(
        activeTab,
        pagination.currentPage - 1,
        pagination.postsPerPage
      )
        .then((res) => {
          res.data.map((booking) => {
            booking.rentFrom = booking.rentFrom.slice(0, 10);
            booking.rentTo = booking.rentTo.slice(0, 10);
            booking.productName = booking.productResponse.name;
            booking.image = booking.productResponse.image;
            booking.borrowerName = booking.borrower.fullName;
            booking.address = booking.borrower.address;
          });
          setBookings(res.data);
          setPagination({
            ...pagination,
            totalPosts: res.totalElements,
            currentPage: res.currentPage,
            currentElements: res.currentElements,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const paginateFront = () => {
    const totalPages = Math.ceil(
      pagination.totalPosts / pagination.postsPerPage
    );
    if (pagination.currentPage >= totalPages - 1) return;
    else
      BookingService.ownerRentals(
        activeTab,
        pagination.currentPage + 1,
        pagination.postsPerPage
      )
        .then((res) => {
          res.data.map((booking) => {
            booking.rentFrom = booking.rentFrom.slice(0, 10);
            booking.rentTo = booking.rentTo.slice(0, 10);
            booking.productName = booking.productResponse.name;
            booking.image = booking.productResponse.image;
            booking.borrowerName = booking.borrower.fullName;
            booking.address = booking.borrower.address;
          });
          setBookings(res.data);
          setPagination({
            ...pagination,
            totalPosts: res.totalElements,
            currentPage: res.currentPage,
            currentElements: res.currentElements,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const getBookings = (activeTab) => {
    setBookings(null);
    BookingService.ownerRentals(
      activeTab,
      pagination.currentPage,
      pagination.postsPerPage
    )
      .then((res) => {
        res.data.map((booking) => {
          booking.rentFrom = booking.rentFrom.slice(0, 10);
          booking.rentTo = booking.rentTo.slice(0, 10);
          booking.productName = booking.productResponse.name;
          booking.image = booking.productResponse.image1;
          booking.borrowerName = booking.borrower.fullName;
          booking.address = booking.borrower.address;
        });
        setBookings(res.data);
        setPagination({
          ...pagination,
          totalPosts: res.totalElements,
          currentPage: res.currentPage,
          currentElements: res.currentElements,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getBookings(activeTab);
  }, []);
  return (
    <div>
      <PageHeader title="Rentals" description="Manage your rentals here" />
      {/* tab with completed, accepted and lent */}
      <ul
        className="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
        role="tablist"
      >
        <Tab
          id="accepted"
          label="Accepted"
          isActive={activeTab === "accepted"}
          onClick={() => handleTabClick("accepted")}
        />
        <Tab
          id="lent"
          label="Lent"
          isActive={activeTab === "lent"}
          onClick={() => handleTabClick("lent")}
        />
        <Tab
          id="completed"
          label="Completed"
          isActive={activeTab === "completed"}
          onClick={() => handleTabClick("completed")}
        />
      </ul>

      {/* Rentals Table */}
      <CommonTable
        columns={[
          "productName",
          "image",
          "borrowerName",
          "address",
          "rentFrom",
          "rentTo",
          "status",
        ]}
        data={bookings}
        actions={[
          // accept and reject
          {
            name: "Mark as received",
            type: "markAsReceived",
            onClick: (e, id) => {
              e.preventDefault();
              handleReturned(id);
            },
          },
        ]}
      />
      <Pagination
        startIndex={pagination.currentPage * pagination.postsPerPage + 1}
        endIndex={
          pagination.currentPage * pagination.postsPerPage +
          pagination.currentElements
        }
        postsPerPage={pagination.postsPerPage}
        totalPosts={pagination.totalPosts}
        paginateBack={paginateBack}
        paginateFront={paginateFront}
      />
    </div>
  );
};

const Tab = ({ id, label, isActive, onClick }) => {
  return (
    <li role="presentation">
      <a
        className={`my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 ${
          isActive
            ? "border-transparent bg-neutral-100 focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary text-blue-900"
            : "hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary"
        }`}
        data-te-toggle="pill"
        data-te-target={`#${id}`}
        data-nav-active={isActive ? true : undefined}
        role="tab"
        aria-controls={id}
        aria-selected={isActive ? true : false}
        onClick={onClick}
      >
        {label}
      </a>
    </li>
  );
};

export default Page;
