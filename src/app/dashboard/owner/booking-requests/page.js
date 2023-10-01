"use client";

import CommonTable from "@/components/GlobalComponents/CommonTable";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import BookingService from "@/lib/services/bookingService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const handleAccept = (id) => {
    BookingService.acceptBooking(id)
      .then((res) => {
        toast.success("Booking Accepted");
        getBookings();
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  const handleReject = (id) => {
    BookingService.rejectBooking(id)
      .then((res) => {
        toast.success("Booking Rejected");
        getBookings();
      })
      .catch((err) => {
        console.log(err);
      });
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
  };
  useEffect(() => {
    getBookings();
  }, []);
  return (
    <>
      <PageHeader
        title="Booking Requests"
        description="Manage your booking requests here"
        actions={[]}
      />
      {/* booking requests common table, product name , image, user name, address, from Date, to Date*/}
      <CommonTable
        columns={[
          "productName",
          "image",
          "borrowerName",
          "address",
          "rentFrom",
          "rentTo",
        ]}
        data={bookings}
        actions={[
          // accept and reject
          {
            name: "Accept",
            type: "accept",
            onClick: (e, id) => {
              e.preventDefault();
              handleAccept(id);
            },
          },
          {
            name: "Reject",
            type: "reject",
            onClick: (e, id) => {
              e.preventDefault();
              handleReject(id);
            },
          },
        ]}
      />
    </>
  );
};

export default Page;
