"use client";
import CommonTable from "@/components/GlobalComponents/CommonTable";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import CategoryService from "@/lib/services/categoryService";
import { setCategory } from "@/store/Slices/categorySlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const { category } = useSelector((state) => state.category);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!category) {
      CategoryService.getAll()
        .then((res) => {
          dispatch(setCategory(res));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [category, dispatch]);

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
        columns={["id", "name", "description"]}
        data={
          category &&
          category.map((item) => {
            return {
              id: item.id,
              name: item.name,
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
                  CategoryService.getAll()
                    .then((e) => {
                      dispatch(setCategory(e));
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
    </div>
  );
};
export default Page;
