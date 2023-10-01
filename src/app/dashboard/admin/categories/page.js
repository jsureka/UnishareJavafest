"use client";
import CommonTable from "@/components/GlobalComponents/CommonTable";
import Pagination from "@/components/GlobalComponents/Pagination";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import CategoryService from "@/lib/services/categoryService";
import { setCategory } from "@/store/Slices/categorySlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const { category } = useSelector((state) => state.category);
  const router = useRouter();
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    currentPage: 0,
    postsPerPage: 5,
    currentElements: 0,
    totalPosts: 0,
  });

  const paginateBack = () => {
    if (pagination.currentPage <= 0) return;
    else
      CategoryService.getPaginated(
        pagination.currentPage - 1,
        pagination.postsPerPage
      )
        .then((res) => {
          dispatch(setCategory(res.data));
          setPagination({
            ...pagination,
            totalPosts: res.totalElements,
            currentPage: res.currentPage,
            currentElements: res.currentElements,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const paginateFront = () => {
    const totalPages = Math.ceil(
      pagination.totalPosts / pagination.postsPerPage
    );
    if (pagination.currentPage >= totalPages - 1) return;
    else
      CategoryService.getPaginated(
        pagination.currentPage + 1,
        pagination.postsPerPage
      )
        .then((res) => {
          dispatch(setCategory(res.data));
          setPagination({
            ...pagination,
            totalPosts: res.totalElements,
            currentPage: res.currentPage,
            currentElements: res.currentElements,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    CategoryService.getPaginated(
      pagination.currentPage,
      pagination.postsPerPage
    )
      .then((res) => {
        dispatch(setCategory(res.data));
        setPagination({
          ...pagination,
          totalPosts: res.totalElements,
          currentPage: res.currentPage,
          currentElements: res.currentElements,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <PageHeader
        title="Categories"
        description={`Total ${category && category.length} categories`}
        actions={[
          {
            name: "Add New",
            type: "addNew",
            href: "/dashboard/admin/categories/add",
          },
        ]}
      />
      <CommonTable
        columns={["id", "categoryName", "description"]}
        data={
          category &&
          category.map((item) => {
            return {
              id: item.id,
              categoryName: item.categoryName,
              description: item.description,
            };
          })
        }
        actions={[
          {
            name: "Edit",
            type: "edit",
            onClick: (e, id) => {
              console.log("Edit");
              router.push(`/dashboard/admin/categories/${id}`);
            },
          },
          {
            name: "Delete",
            type: "delete",
            onClick: (e, id) => {
              CategoryService.delete(id)
                .then((res) => {
                  toast.success("Category deleted successfully");
                  CategoryService.getPaginated(
                    pagination.currentPage,
                    pagination.postsPerPage
                  )
                    .then((res) => {
                      dispatch(setCategory(res.data));
                      setPagination({
                        ...pagination,
                        totalPosts: res.totalElements,
                        currentPage: res.currentPage,
                        currentElements: res.currentElements,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
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
    </div>
  );
};
export default Page;
