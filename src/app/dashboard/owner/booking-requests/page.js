"use client";

import CommonTable from "@/components/GlobalComponents/CommonTable";
import Pagination from "@/components/GlobalComponents/Pagination";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import BookingService from "@/lib/services/bookingService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    postsPerPage: 5,
    currentElements: 0,
    totalPosts: 0,
  });
  const handleAccept = (id) => {
    BookingService.acceptBooking(id)
      .then((res) => {
        toast.success("Booking Accepted");
        BookingService.ownerPending(
          pagination.currentPage,
          pagination.postsPerPage
        )
          .then((res) => {
            setBookingsData(res);
          })
          .catch((err) => {
            console.log(err);
          });
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

  const paginateBack = () => {
    if (pagination.currentPage <= 0) return;
    else
      BookingService.ownerPending(
        pagination.currentPage - 1,
        pagination.postsPerPage
      )
        .then((res) => {
          setBookingsData(res);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const setBookingsData = (res) => {
    res.data.forEach((booking) => {
      booking.image = booking.productResponse.image1;
      booking.productName = booking.productResponse.name;
      booking.borrowerName = booking.borrower.fullName;
      booking.address = booking.borrower.address;
      booking.rentFrom = booking.rentFrom.slice(0, 10);
      booking.rentTo = booking.rentTo.slice(0, 10);
    });
    setBookings(res.data);
    setPagination({
      ...pagination,
      totalPosts: res.totalElements,
      currentPage: res.currentPage,
      currentElements: res.currentElements,
    });
  };

  const paginateFront = () => {
    const totalPages = Math.ceil(
      pagination.totalPosts / pagination.postsPerPage
    );
    if (pagination.currentPage >= totalPages - 1) return;
    else
      BookingService.ownerPending(
        pagination.currentPage + 1,
        pagination.postsPerPage
      )
        .then((res) => {
          setBookingsData(res);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    BookingService.ownerPending(pagination.currentPage, pagination.postsPerPage)
      .then((res) => {
        setBookingsData(res);
      })
      .catch((err) => {
        console.log(err);
      });
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
    </>
  );
};

export default Page;
