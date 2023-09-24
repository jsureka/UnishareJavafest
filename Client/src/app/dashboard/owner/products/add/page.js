"use client";

import PageHeader from "@/components/OwnerComponents/PageHeader";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <>
      {/* Header add new */}
      <PageHeader
        title="Add New Product"
        description="Add new product here"
        backlink="/dashboard/owner/products"
        actions={[
          {
            name: "Submit",
            type: "submit",
            onClick: () => {
              console.log("Submit");
              router.push("/dashboard/owner/products");
            },
          },
          {
            name: "Reset",
            type: "reset",
            onClick: () => {
              console.log("Reset");
            },
          },
        ]}
      />
      {/* form center */}
      <div className="flex justify-center mt-5 p-5">
        <form className="w-full max-w-lg">
          {/* name */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-name"
              >
                Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-name"
                type="text"
                placeholder="Product Name"
              />
            </div>
          </div>
          {/* price per day*/}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-price"
              >
                Price per day
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-price"
                type="number"
                placeholder="Price per day"
              />
            </div>
          </div>
          {/* description */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-description"
              >
                Description
              </label>
              <textarea
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-description"
                type="text"
                placeholder="Description"
              />
            </div>
          </div>
          {/* images grid */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-images"
              >
                Images
              </label>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-images"
                    type="file"
                    placeholder="Images"
                    multiple
                  />
                </div>
              </div>
            </div>
          </div>
          {/* category */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-category"
              >
                Category
              </label>
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-category"
              >
                <option>Category 1</option>
                <option>Category 2</option>
                <option>Category 3</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
