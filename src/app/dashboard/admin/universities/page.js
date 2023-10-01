"use client";
import CommonTable from "@/components/GlobalComponents/CommonTable";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import UniversityService from "@/lib/services/universityService";
import { setUniversity } from "@/store/Slices/universitySlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const { university } = useSelector((state) => state.university);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = university?.slice(indexOfFirstPost, indexOfLastPost);

  const paginateFront = () => {
    const totalPages = Math.ceil(university?.length / postsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginateBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (!university) {
      UniversityService.getAll()
        .then((res) => {
          dispatch(setUniversity(res.data));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [university, dispatch]);

  return (
    <div>
      <PageHeader
        title="Universties"
        description={`Total ${university && university.length} universities`}
        actions={[
          {
            name: "Add New",
            type: "addNew",
            href: "/dashboard/admin/universities/add",
          },
        ]}
      />
      <CommonTable
        columns={["id", "universityName"]}
        data={
          university &&
          university.map((item) => {
            return {
              id: item.id,
              universityName: item.universityName,
            };
          })
        }
        actions={[
          {
            name: "Delete",
            type: "delete",
            onClick: (e, id) => {
              UniversityService.delete(id)
                .then((res) => {
                  toast.success("university deleted successfully");
                  UniversityService.getAll()
                    .then((e) => {
                      dispatch(setUniversity(e));
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
            },
          },
        ]}
      />
      {/* <Pagination
        postsPerPage={postsPerPage}
        totalPosts={university?.length}
        paginateBack={paginateBack}
        paginateFront={paginateFront}
        currentPage={currentPage}
      /> */}
    </div>
  );
};
export default Page;
