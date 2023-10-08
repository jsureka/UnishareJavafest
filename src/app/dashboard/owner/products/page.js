"use client";
import CommonTable from "@/components/GlobalComponents/CommonTable";
import Pagination from "@/components/GlobalComponents/Pagination";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import ProductService from "@/lib/services/productService";
import { setMyProducts } from "@/store/Slices/productSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const products = useSelector((state) => state.product.myProducts);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    postsPerPage: 5,
    currentElements: 0,
    totalPosts: 0,
  });

  const paginateBack = () => {
    if (pagination.currentPage <= 0) return;
    else
      ProductService.getPaginated(
        user?.id,
        pagination.currentPage - 1,
        pagination.postsPerPage
      )
        .then((res) => {
          dispatch(setMyProducts(res.data));
          setPagination({
            ...pagination,
            totalPosts: res.totalElements,
            currentPage: res.currentPage,
            currentElements: res.currentElements,
          });
        })
        .catch((err) => {
          toast.error(err.message);
        });
  };

  const paginateFront = () => {
    const totalPages = Math.ceil(
      pagination.totalPosts / pagination.postsPerPage
    );
    if (pagination.currentPage >= totalPages - 1) return;
    else
      ProductService.getByUser(
        user?.id,
        pagination.currentPage + 1,
        pagination.postsPerPage
      )
        .then((res) => {
          dispatch(setMyProducts(res.data));
          setPagination({
            ...pagination,
            totalPosts: res.totalElements,
            currentPage: res.currentPage,
            currentElements: res.currentElements,
          });
        })
        .catch((err) => {
          toast.error(err.message);
        });
  };

  const handleRestrict = (e, id) => {
    ProductService.restrict(id)
      .then((res) => {
        toast.success("Product restricted successfully");
        getProducts();
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const getProducts = () => {
    ProductService.getByUser(
      user?.id,
      pagination.currentPage,
      pagination.postsPerPage
    )
      .then((res) => {
        dispatch(setMyProducts(res.data));
        setPagination({
          ...pagination,
          totalPosts: res.totalElements,
          currentPage: res.currentPage,
          currentElements: res.currentElements,
        });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (!products && user) {
      getProducts();
    }
  }, [products, user, dispatch, pagination]);

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
        columns={[
          "image",
          "name",
          "basePrice",
          "perDayPrice",
          "status",
          "description",
        ]}
        data={
          products &&
          products.map((product) => {
            return {
              image: product.image1,
              name: product.name,
              basePrice: product.basePrice,
              perDayPrice: product.perDayPrice,
              status: product.status,
              description: product.description,
            };
          })
        }
        // actions={
        //   [
        //     // {
        //     //   name: "Delete",
        //     //   type: "delete",
        //     //   onClick: (e, id) => {
        //     //     handleRestrict(e, id);
        //     //   },
        //     // },
        //   ]
        // }
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
