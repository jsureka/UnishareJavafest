"use client";

import CommonTable from "@/components/GlobalComponents/CommonTable";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import BookingService from "@/lib/services/bookingService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [bookings, setBookings] = useState([]);
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
  const getBookings = () => {
    BookingService.getAll()
      .then((res) => {
        res.map((booking) => {
          booking.rentFrom = booking.rentFrom.slice(0, 10);
          booking.rentTo = booking.rentTo.slice(0, 10);
          booking.productName = booking.productResponse.name;
          booking.image = booking.productResponse.image;
          booking.borrowerName = booking.borrower.fullName;
          booking.address = booking.borrower.address;
        });
        // choose only with pending status
        res = res.filter((booking) => booking.status === "PENDING");
        setBookings(res);
      })
      .catch((err) => {
        console.log(err);
      });
    BookingService.getAll()
      .then((res) => {
        res.map((booking) => {
          booking.rentFrom = booking.rentFrom.slice(0, 10);
          booking.rentTo = booking.rentTo.slice(0, 10);
          booking.productName = booking.productResponse.name;
          booking.image = booking.productResponse.image;
          booking.borrowerName = booking.borrower.fullName;
          booking.address = booking.borrower.address;
        });
        // choose only with pending status
        res = res.filter(
          (booking) =>
            booking.status !== "CANCELLED" &&
            booking.status !== "REJECTED" &&
            booking.status !== "PENDING"
        );
        setBookings(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getBookings();
  }, []);
  return (
    <div>
      <PageHeader title="Rentals" description="Manage your rentals here" />
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
    </div>
  );
};

export default Page;
