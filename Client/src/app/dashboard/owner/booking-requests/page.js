"use client";

import CommonTable from "@/components/GlobalComponents/CommonTable";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Booking Requests"
        description="Manage your booking requests here"
        actions={[
          {
            name: "Add New",
            type: "addNew",
            href: "/dashboard/owner/booking-requests/add",
          },
        ]}
      />
      {/* booking requests common table, product name , image, user name, address, from Date, to Date*/}
      <CommonTable
        columns={[
          "id",
          "productName",
          "image",
          "userName",
          "address",
          "fromDate",
          "toDate",
        ]}
        data={[
          {
            id: 1,
            productName: "Product 1",
            image: 10,
            userName: "User 1",
            address: "Address 1",
            fromDate: "01-01-2021",
            toDate: "02-01-2021",
          },
          {
            id: 2,
            productName: "Product 2",
            image: 20,
            userName: "User 2",
            address: "Address 2",
            fromDate: "02-01-2021",
            toDate: "03-01-2021",
          },
          {
            id: 3,
            productName: "Product 3",
            image: 30,
            userName: "User 3",
            address: "Address 3",
            fromDate: "03-01-2021",
            toDate: "04-01-2021",
          },
        ]}
        actions={[
          // accept and reject
          {
            name: "Accept",
            type: "accept",
            onClick: () => {
              console.log("Accept");
            },
          },
          {
            name: "Reject",
            type: "reject",
            onClick: () => {
              console.log("Reject");
            },
          },
        ]}
      />
    </>
  );
};

export default Page;
