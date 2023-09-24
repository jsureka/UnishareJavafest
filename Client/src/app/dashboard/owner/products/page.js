"use client";
import CommonTable from "@/components/GlobalComponents/CommonTable";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your products here"
        actions={[
          {
            name: "Add New",
            type: "addNew",
            href: "/dashboard/owner/products/add",
          },
        ]}
      />
      {/* Products Table */}
      <CommonTable
        columns={["id", "image", "name", "price", "description"]}
        data={[
          {
            id: 1,
            image: 10,
            name: "Product 1",
            price: 100,
            description: "This is product 1",
          },
          {
            id: 2,
            name: "Product 2",
            price: 200,
            image: 20,
            description: "This is product 2",
          },
          {
            id: 3,
            name: "Product 3",
            price: 300,
            image: 30,
            description: "This is product 3",
          },
        ]}
        actions={[
          {
            name: "Edit",
            type: "edit",
            onClick: () => {
              console.log("Edit");
            },
          },
          {
            name: "Delete",
            type: "delete",
            onClick: () => {
              console.log("Delete");
            },
          },
        ]}
      />
    </>
  );
};

export default Page;
