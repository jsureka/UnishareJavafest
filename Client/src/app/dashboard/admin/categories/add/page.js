"use client";

import PageHeader from "@/components/OwnerComponents/PageHeader";
import CategoryService from "@/lib/services/categoryService";
import { setCategory } from "@/store/Slices/categorySlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  //form for add new category

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const category = {
      name,
      description,
    };
    CategoryService.create(category)
      .then((res) => {
        toast.success("Category added successfully");
        CategoryService.getAll()
          .then((e) => {
            dispatch(setCategory(e));
            router.push("/dashboard/admin/categories");
          })
          .catch((err) => {
            console.log(err);
            toast.error("Something went wrong");
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setName("");
    setDescription("");
    setImage("");
  };

  return (
    <>
      {/* Header add new */}
      <PageHeader
        title="Add New Category"
        description="Add new category here"
        backlink="/dashboard/admin/categories"
        actions={[
          {
            name: "Submit",
            type: "submit",
            onClick: (e) => {
              console.log("Submit");
              handleSubmit(e);
            },
          },
          {
            name: "Reset",
            type: "reset",
            onClick: (e) => {
              console.log("Reset");
              handleReset(e);
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
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
