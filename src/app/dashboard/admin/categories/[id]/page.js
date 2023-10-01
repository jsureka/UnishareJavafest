"use client";

import PageHeader from "@/components/OwnerComponents/PageHeader";
import CategoryService from "@/lib/services/categoryService";
import { setCategory } from "@/store/Slices/categorySlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  //form for add new category
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const category = {
      name,
      description,
      id,
    };
    CategoryService.update(category)
      .then((res) => {
        toast.success("Category updated successfully");
        CategoryService.getAll()
          .then((e) => {
            dispatch(setCategory(e.data));
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

  const handleDelete = (e) => {
    e.preventDefault();
    CategoryService.delete(id)
      .then((res) => {
        toast.success("Category deleted successfully");
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

  useEffect(() => {
    if (id) {
      CategoryService.getOne(id)
        .then((res) => {
          setName(res.name);
          setDescription(res.description);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  return (
    <>
      {/* Header add new */}
      <PageHeader
        title="Edit Category"
        description=" Edit category here"
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
          // delete
          {
            name: "Delete",
            type: "delete",
            onClick: (e) => {
              console.log("Delete");
              handleDelete(e);
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
                required
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
                required
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
