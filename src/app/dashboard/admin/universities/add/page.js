"use client";

import PageHeader from "@/components/OwnerComponents/PageHeader";
import UniversityService from "@/lib/services/universityService";
import { setUniversity } from "@/store/Slices/universitySlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  //form for add new university

  const [universityName, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const university = {
      universityName: universityName,
    };
    UniversityService.create(university)
      .then((res) => {
        toast.success("University added successfully");
        UniversityService.getAll().then((res) => {
          dispatch(setUniversity(res.data));
          router.push("/dashboard/admin/universities");
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
        title="Add New university"
        description="Add new university here"
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
                value={universityName}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
